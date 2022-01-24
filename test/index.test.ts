import {
  createBatchTable,
  findMinMaxBatchSize,
  findUnavailableBatch,
  validateBatchInformation,
} from '../src';
import { batchQuantities, productBatchSizes, batchSizes } from '../src/data';
import { BatchQuantity, BatchSize, ProductBatchSize } from '../src/type';
import { expectedBatchTable } from './testData';

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

describe('find a product with unavailable batch', () => {
  test('should return an array with 1 product and unavailable batch', () => {
    const expectedResult = [
      {
        productCode: 'P4',
        quantity: 234,
      },
    ];
    const returnedBatch = findUnavailableBatch(
      productBatchSizes,
      batchQuantities
    );
    expect(returnedBatch).toMatchObject(expectedResult);
  });

  test('should return an array with a list of products and unavailable batches', () => {
    const productBatchSizes: ProductBatchSize[] = [
      {
        productCode: 'P1',
        batchSizeCode: 'A1',
      },
      {
        productCode: 'P2',
        batchSizeCode: 'A3',
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
    const expectedResult = [
      {
        productCode: 'P3',
        quantity: 300,
      },
      {
        productCode: 'P4',
        quantity: 400,
      },
    ];
    const returnedBatch = findUnavailableBatch(
      productBatchSizes,
      batchQuantities
    );
    expect(returnedBatch).toEqual(expect.arrayContaining(expectedResult));
  });

  test('should return an empty array if all products matches its own batch size', () => {
    const productBatchSizes: ProductBatchSize[] = [
      {
        productCode: 'P1',
        batchSizeCode: 'A1',
      },
      {
        productCode: 'P2',
        batchSizeCode: 'A3',
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
    const returnedBatch = findUnavailableBatch(
      productBatchSizes,
      batchQuantities
    );
    expect(returnedBatch).toEqual([]);
  });
});

describe('validate batch information', () => {
  test('should return positive min, max and number of batches', () => {
    const batch1: BatchSize = {
      code: 'A1',
      size: 10,
    };
    const batch2: BatchSize = {
      code: 'A2',
      size: 20,
    };
    const returnedBatchInformation = validateBatchInformation(
      batch1,
      batch2,
      100
    );
    expect(returnedBatchInformation).toEqual(
      expect.objectContaining({
        min: batch1,
        max: batch2,
        batchQuantity: 100,
      })
    );
  });

  test('should not return a negative number for size', () => {
    const batch1: BatchSize = {
      code: 'A1',
      size: -10,
    };
    const batch2: BatchSize = {
      code: 'A2',
      size: 20,
    };
    const returnedBatchInformation = validateBatchInformation(
      batch1,
      batch2,
      100
    );
    expect(returnedBatchInformation).toEqual(
      expect.objectContaining({
        min: undefined,
        max: batch2,
        batchQuantity: 100,
      })
    );
  });

  test('should not return a negative number for size', () => {
    const batch1: BatchSize = {
      code: 'A1',
      size: -10,
    };
    const batch2: BatchSize = {
      code: 'A2',
      size: -20,
    };
    const returnedBatchInformation = validateBatchInformation(
      batch2,
      batch1,
      -20
    );
    expect(returnedBatchInformation).toEqual(
      expect.objectContaining({
        min: undefined,
        max: undefined,
        batchQuantity: undefined,
      })
    );
  });

  test('should return undefined when there is no parameter given', () => {
    const returnedBatchInformation = validateBatchInformation();
    expect(returnedBatchInformation).toEqual(
      expect.objectContaining({
        min: undefined,
        max: undefined,
        batchQuantity: undefined,
      })
    );
  });
});

describe('create batch table', () => {
  test('create batch table with enough information', () => {
    const returnedBatchTable = createBatchTable(
      batchSizes,
      productBatchSizes,
      batchQuantities
    );

    expect(returnedBatchTable).toEqual(expectedBatchTable);
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
