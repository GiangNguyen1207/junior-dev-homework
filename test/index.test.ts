import {
  createBatchTable,
  createOrders,
  findBatchQuantity,
  findMinMaxBatchSize,
  produceOrder,
} from '../src';
import {
  BatchQuantity,
  BatchSize,
  BatchTable,
  Product,
  ProductBatchSize,
} from '../src/type';
import {
  mockedBatchTable,
  products,
  batchSizes,
  productBatchSizes,
  batchQuantities,
  mockedOrderUseMax,
  mockedOrderUseMin,
} from './testData';

describe('find min and max of batch size', () => {
  test('should return the smaller batch size', () => {
    const currentBatch: BatchSize = {
      code: 'A1',
      size: 10,
    };
    const previousBatch: BatchSize = {
      code: 'A2',
      size: 20,
    };
    const returnedBatch = findMinMaxBatchSize(
      false,
      currentBatch,
      previousBatch
    );
    expect(returnedBatch).toEqual(currentBatch);
    expect(returnedBatch?.size).toEqual(10);
  });

  test('should return the bigger batch size', () => {
    const currentBatch: BatchSize = {
      code: 'A1',
      size: 10,
    };
    const previousBatch: BatchSize = {
      code: 'A2',
      size: 20,
    };
    const returnedBatch = findMinMaxBatchSize(
      true,
      currentBatch,
      previousBatch
    );
    expect(returnedBatch).toEqual(previousBatch);
    expect(returnedBatch?.size).toEqual(20);
  });

  test('should return undefined when there is no previous batch', () => {
    const currentBatch: BatchSize = {
      code: 'A1',
      size: 10,
    };
    const returnedBatch = findMinMaxBatchSize(false, currentBatch);
    expect(returnedBatch).toEqual(undefined);
  });
});

describe('find number of batches', () => {
  test('should return correct number of batchs', () => {
    const batchQuantities: BatchQuantity[] = [
      {
        productCode: 'P1',
        quantity: 100,
      },
    ];
    const numberOfBatch = findBatchQuantity(batchQuantities, 'P1');
    expect(numberOfBatch).toEqual(100);
  });

  test('should return undefined when number of batch < 0', () => {
    const batchQuantities: BatchQuantity[] = [
      {
        productCode: 'P1',
        quantity: -100,
      },
    ];
    const numberOfBatch = findBatchQuantity(batchQuantities, 'P1');
    expect(numberOfBatch).toEqual(undefined);
  });

  test('should return undefined when there is no batch found', () => {
    const batchQuantities: BatchQuantity[] = [
      {
        productCode: 'P1',
        quantity: 100,
      },
    ];
    const numberOfBatch = findBatchQuantity(batchQuantities, 'P2');
    expect(numberOfBatch).toEqual(undefined);
  });
});

describe('create batch table', () => {
  test('create batch table with enough information', () => {
    const returnedBatchTable = createBatchTable(
      batchSizes,
      productBatchSizes,
      batchQuantities
    );

    expect(returnedBatchTable).toEqual(mockedBatchTable);
  });

  test('should skip to next round when there is batch code that can not be found in the table', () => {
    const returnedBatchTable = createBatchTable(
      batchSizes,
      productBatchSizes,
      batchQuantities
    );

    expect(returnedBatchTable['P5'].min).toEqual(
      expect.not.objectContaining({ code: 'BS8' })
    );
    expect(returnedBatchTable['P5'].max).toEqual(
      expect.not.objectContaining({ code: 'BS8' })
    );
  });

  test('should return same size for min and max when there is only 1 size', () => {
    const batchSizes: BatchSize[] = [
      {
        code: 'A1',
        size: 10,
      },
    ];
    const productBatchSizes: ProductBatchSize[] = [
      {
        productCode: 'P1',
        batchSizeCode: 'A1',
      },
    ];
    const batchQuantities: BatchQuantity[] = [
      {
        productCode: 'P1',
        quantity: 100,
      },
    ];
    const returnedBatchTable = createBatchTable(
      batchSizes,
      productBatchSizes,
      batchQuantities
    );
    expect(returnedBatchTable).toHaveProperty('P1', {
      min: batchSizes[0],
      max: batchSizes[0],
      batchQuantity: 100,
    });
  });

  test('should return correct min and max size when there are more than 3 options for sizes', () => {
    const batchSizes: BatchSize[] = [
      {
        code: 'A1',
        size: 10,
      },
      {
        code: 'A2',
        size: 20,
      },
      {
        code: 'A3',
        size: 30,
      },
    ];
    const productBatchSizes: ProductBatchSize[] = [
      {
        productCode: 'P1',
        batchSizeCode: 'A1',
      },
      {
        productCode: 'P1',
        batchSizeCode: 'A2',
      },
      {
        productCode: 'P1',
        batchSizeCode: 'A3',
      },
    ];
    const batchQuantities: BatchQuantity[] = [
      {
        productCode: 'P1',
        quantity: 100,
      },
    ];
    const returnedBatchTable = createBatchTable(
      batchSizes,
      productBatchSizes,
      batchQuantities
    );
    expect(returnedBatchTable).toHaveProperty('P1', {
      min: batchSizes[0],
      max: batchSizes[2],
      batchQuantity: 100,
    });
  });

  test('should not return min and max size when all the batch sizes are negative numbers', () => {
    const batchSizes: BatchSize[] = [
      {
        code: 'A1',
        size: -10,
      },
      {
        code: 'A2',
        size: -20,
      },
    ];
    const productBatchSizes: ProductBatchSize[] = [
      {
        productCode: 'P1',
        batchSizeCode: 'A1',
      },
      {
        productCode: 'P1',
        batchSizeCode: 'A2',
      },
    ];
    const batchQuantities: BatchQuantity[] = [
      {
        productCode: 'P1',
        quantity: 100,
      },
    ];

    const returnedBatchTable = createBatchTable(
      batchSizes,
      productBatchSizes,
      batchQuantities
    );

    expect(returnedBatchTable['P1']).toEqual(
      expect.objectContaining({ batchQuantity: 100 })
    );
  });

  test('should not return undefined when there is one (or more) positive numbers for size', () => {
    const batchSizes: BatchSize[] = [
      {
        code: 'A1',
        size: -10,
      },
      {
        code: 'A2',
        size: -20,
      },
      {
        code: 'A3',
        size: 30,
      },
    ];
    const productBatchSizes: ProductBatchSize[] = [
      {
        productCode: 'P1',
        batchSizeCode: 'A1',
      },
      {
        productCode: 'P1',
        batchSizeCode: 'A2',
      },
      {
        productCode: 'P1',
        batchSizeCode: 'A3',
      },
    ];
    const batchQuantities: BatchQuantity[] = [
      {
        productCode: 'P1',
        quantity: 100,
      },
    ];
    const returnedBatchTable = createBatchTable(
      batchSizes,
      productBatchSizes,
      batchQuantities
    );
    expect(returnedBatchTable['P1']).toEqual(
      expect.objectContaining({
        min: batchSizes[2],
        max: batchSizes[2],
        batchQuantity: 100,
      })
    );
  });

  test('should return undefined when there is no batch quantity found', () => {
    const productBatchSizes: ProductBatchSize[] = [
      {
        productCode: 'P1',
        batchSizeCode: 'A1',
      },
      {
        productCode: 'P2',
        batchSizeCode: 'A2',
      },
    ];
    const batchSizes: BatchSize[] = [
      {
        code: 'A1',
        size: 10,
      },
      {
        code: 'A2',
        size: 20,
      },
    ];
    const batchQuantities: BatchQuantity[] = [
      {
        productCode: 'P1',
        quantity: 100,
      },
    ];
    const returnedBatchTable = createBatchTable(
      batchSizes,
      productBatchSizes,
      batchQuantities
    );
    expect(returnedBatchTable['P2'].batchQuantity).toEqual(undefined);
  });

  test('should return undefined when the number of batch < 0', () => {
    const productBatchSizes: ProductBatchSize[] = [
      {
        productCode: 'P1',
        batchSizeCode: 'A1',
      },
      {
        productCode: 'P2',
        batchSizeCode: 'A2',
      },
    ];
    const batchSizes: BatchSize[] = [
      {
        code: 'A1',
        size: 10,
      },
      {
        code: 'A2',
        size: 20,
      },
    ];
    const batchQuantities: BatchQuantity[] = [
      {
        productCode: 'P1',
        quantity: 100,
      },
      {
        productCode: 'P2',
        quantity: -200,
      },
    ];
    const returnedBatchTable = createBatchTable(
      batchSizes,
      productBatchSizes,
      batchQuantities
    );
    expect(returnedBatchTable['P1'].batchQuantity).toEqual(100);
    expect(returnedBatchTable['P2'].batchQuantity).toEqual(undefined);
  });

  test('should return undefined when the batch is not in product batch sizes and the number of batch < 0 a', () => {
    const productBatchSizes: ProductBatchSize[] = [
      {
        productCode: 'P1',
        batchSizeCode: 'A1',
      },
    ];
    const batchSizes: BatchSize[] = [
      {
        code: 'A1',
        size: 10,
      },
    ];
    const batchQuantities: BatchQuantity[] = [
      {
        productCode: 'P1',
        quantity: 100,
      },
      {
        productCode: 'P2',
        quantity: -200,
      },
    ];
    const returnedBatchTable = createBatchTable(
      batchSizes,
      productBatchSizes,
      batchQuantities
    );
    expect(returnedBatchTable['P1'].batchQuantity).toEqual(100);
    expect(returnedBatchTable['P2'].batchQuantity).toEqual(undefined);
  });

  test('should add more products to batch table', () => {
    const batchSizes: BatchSize[] = [
      {
        code: 'A1',
        size: 10,
      },
      {
        code: 'A2',
        size: 20,
      },
    ];
    const productBatchSizes: ProductBatchSize[] = [
      {
        productCode: 'P1',
        batchSizeCode: 'A1',
      },
      {
        productCode: 'P2',
        batchSizeCode: 'A2',
      },
    ];
    const batchQuantities: BatchQuantity[] = [
      {
        productCode: 'P1',
        quantity: 100,
      },
      {
        productCode: 'P2',
        quantity: 200,
      },
      {
        productCode: 'P3',
        quantity: 300,
      },
      {
        productCode: 'P4',
        quantity: 400,
      },
    ];
    const returnedBatchTable = createBatchTable(
      batchSizes,
      productBatchSizes,
      batchQuantities
    );
    expect(returnedBatchTable).toHaveProperty('P3');
    expect(returnedBatchTable).toHaveProperty('P4');
    expect(returnedBatchTable['P3'].batchQuantity).toEqual(300);
    expect(returnedBatchTable['P4'].batchQuantity).toEqual(400);
  });

  test('should add products to batch table when size < 0', () => {
    const batchSizes: BatchSize[] = [
      {
        code: 'A1',
        size: -10,
      },
    ];
    const productBatchSizes: ProductBatchSize[] = [
      {
        productCode: 'P1',
        batchSizeCode: 'A1',
      },
    ];
    const batchQuantities: BatchQuantity[] = [
      {
        productCode: 'P1',
        quantity: 100,
      },
    ];
    const returnedBatchTable = createBatchTable(
      batchSizes,
      productBatchSizes,
      batchQuantities
    );
    expect(Object.keys(returnedBatchTable)).toHaveLength(1);
  });

  test('should not add more products to batch table', () => {
    const batchSizes: BatchSize[] = [
      {
        code: 'A1',
        size: 10,
      },
      {
        code: 'A2',
        size: 20,
      },
    ];
    const productBatchSizes: ProductBatchSize[] = [
      {
        productCode: 'P1',
        batchSizeCode: 'A1',
      },
      {
        productCode: 'P2',
        batchSizeCode: 'A2',
      },
    ];
    const batchQuantities: BatchQuantity[] = [
      {
        productCode: 'P1',
        quantity: 100,
      },
      {
        productCode: 'P2',
        quantity: 200,
      },
    ];
    const returnedBatchTable = createBatchTable(
      batchSizes,
      productBatchSizes,
      batchQuantities
    );
    expect(Object.keys(returnedBatchTable)).toHaveLength(2);
  });
});

describe('create orders', () => {
  test('should take the value from column max when useMax is true', () => {
    const orders = createOrders(products, mockedBatchTable, true);
    expect(orders[1]).toHaveProperty('batchSizeCode', 'BS3');
    expect(orders[1]).toHaveProperty('batchSize', 40);
    expect(orders[2]).toHaveProperty('batchSizeCode', 'BS5');
    expect(orders[2]).toHaveProperty('batchSize', 100);
  });

  test('should take the value from column min when useMax is false', () => {
    const orders = createOrders(products, mockedBatchTable, false);
    expect(orders[1]).toHaveProperty('batchSizeCode', 'BS1');
    expect(orders[1]).toHaveProperty('batchSize', 20);
    expect(orders[2]).toHaveProperty('batchSizeCode', 'BS4');
    expect(orders[2]).toHaveProperty('batchSize', 50);
  });

  test('should return the default batch code/batch size when there is no batch code from batch table and useMax is true', () => {
    const products: Product[] = [
      {
        code: 'P1',
        name: 'Milk',
        price: 1.99,
      },
      {
        code: 'P2',
        name: 'Sour Milk',
        price: 2.05,
      },
    ];
    const batchTable: BatchTable = {
      P1: {
        min: {
          code: 'A1',
          size: 10,
        },
        max: {
          code: 'A2',
          size: 20,
        },
        batchQuantity: 20,
      },
      P2: {
        batchQuantity: 200,
      },
    };
    const orders = createOrders(products, batchTable, true);
    expect(orders[1]).toHaveProperty('batchSizeCode', 'BS_GENERATED_P2');
    expect(orders[1]).toHaveProperty('batchSize', 1);
    expect(orders[0]).toHaveProperty('batchSizeCode', 'A2');
    expect(orders[0]).toHaveProperty('batchSize', 20);
  });

  test('should return the default batch code/batch size when there is no batch size from batch table and useMax is false', () => {
    const products: Product[] = [
      {
        code: 'P1',
        name: 'Milk',
        price: 1.99,
      },
      {
        code: 'P2',
        name: 'Sour Milk',
        price: 2.05,
      },
    ];
    const batchTable: BatchTable = {
      P1: {
        min: {
          code: 'A1',
          size: 10,
        },
        max: {
          code: 'A2',
          size: 20,
        },
        batchQuantity: 20,
      },
      P2: {
        batchQuantity: 200,
      },
    };
    const orders = createOrders(products, batchTable, false);
    expect(orders[1]).toHaveProperty('batchSizeCode', 'BS_GENERATED_P2');
    expect(orders[1]).toHaveProperty('batchSize', 1);
    expect(orders[0]).toHaveProperty('batchSizeCode', 'A1');
    expect(orders[0]).toHaveProperty('batchSize', 10);
  });

  test('should return 1 when number of batches from batch table is undefined', () => {
    const products: Product[] = [
      {
        code: 'P1',
        name: 'Milk',
        price: 1.99,
      },
      {
        code: 'P2',
        name: 'Sour Milk',
        price: 2.05,
      },
    ];
    const batchTable: BatchTable = {
      P1: {
        min: {
          code: 'A1',
          size: 10,
        },
        max: {
          code: 'A2',
          size: 20,
        },
        batchQuantity: undefined,
      },
      P2: {
        batchQuantity: 200,
      },
    };
    const orders = createOrders(products, batchTable, true);
    expect(orders.find((order) => order.productCode === 'P1')).toHaveProperty(
      'numberOfBatches',
      1
    );
    expect(orders.find((order) => order.productCode === 'P2')).toHaveProperty(
      'numberOfBatches',
      200
    );
  });
});

describe('produce orders', () => {
  test('should return right orders when useMax is true', () => {
    const orders = produceOrder(
      products,
      batchSizes,
      productBatchSizes,
      batchQuantities,
      true
    );
    expect(orders).toEqual(mockedOrderUseMax);
  });

  test('should return right orders when useMax is false', () => {
    const orders = produceOrder(
      products,
      batchSizes,
      productBatchSizes,
      batchQuantities,
      false
    );
    expect(orders).toEqual(mockedOrderUseMin);
  });
});
