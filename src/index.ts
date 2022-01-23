import {
  products,
  batchQuantities,
  batchSizes,
  productBatchSizes,
} from './data';
import {
  Product,
  BatchSize,
  ProductBatchSize,
  BatchQuantity,
  BatchTable,
  BatchInformation,
  Order,
} from './type';

const produceOrder = (
  products: Product[],
  batchSizes: BatchSize[],
  productBatchSizes: ProductBatchSize[],
  batchQuantities: BatchQuantity[],
  useMax: boolean
): Order[] => {
  //1. create Batch Table
  const batchTable = createBatchTable(
    batchSizes,
    productBatchSizes,
    batchQuantities
  );

  //2. create orders
  return createOrders(products, batchTable, useMax);
};

const createOrders = (
  products: Product[],
  batchTable: BatchTable,
  useMax: boolean
): Order[] => {
  let orders: Order[] = [];
  products.forEach((product) => {
    const defaultBatchSize: BatchSize = {
      code: `BS_GENERATED_${product.code}`,
      size: 1,
    };

    const order: Order = {
      productCode: product.code,
      productName: product.name,
      batchSizeCode:
        (useMax
          ? batchTable[product.code].max?.code
          : batchTable[product.code].min?.code) || defaultBatchSize.code,
      batchSize:
        (useMax
          ? batchTable[product.code].max?.size
          : batchTable[product.code].min?.size) || defaultBatchSize.size,
      numberOfBatches: batchTable[product.code].batchQuantiy ?? 1,
      price: product.price,
    };
    orders.push(order);
  });
  console.log(orders);
  return orders;
};

const createBatchTable = (
  batchSizes: BatchSize[],
  productBatchSizes: ProductBatchSize[],
  batchQuantities: BatchQuantity[]
) => {
  const batchTable: BatchTable = {};

  productBatchSizes.forEach((productBatchSize) => {
    const productCode = productBatchSize.productCode;
    const batchFound = batchSizes.find(
      (batch) => batch.code === productBatchSize.batchSizeCode
    );
    const batchInformation: BatchInformation = {};

    if (batchFound) {
      batchInformation.min = batchTable[productCode]
        ? findMinMaxBatchSize(false, batchFound, batchTable[productCode].min)
        : batchFound;
      batchInformation.max = batchTable[productCode]
        ? findMinMaxBatchSize(true, batchFound, batchTable[productCode].max)
        : batchFound;
      batchInformation.batchQuantiy = batchQuantities.find(
        (quantity) => quantity.productCode === productCode
      )?.quantity;
    } else return;

    batchTable[productCode] = batchInformation;
  });

  createUnavailableBatchSize(batchTable);
  return batchTable;
};

const createUnavailableBatchSize = (batchTable: BatchTable) => {
  const productCodes = productBatchSizes.map((batch) => batch.productCode);
  const unavailableBatchSize = products.filter(
    (product) => !productCodes.includes(product.code)
  );

  if (unavailableBatchSize.length > 0) {
    unavailableBatchSize.forEach((batchSize) => {
      batchTable[batchSize.code] = {
        batchQuantiy: batchQuantities.find(
          (quantity) => quantity.productCode === batchSize.code
        )?.quantity,
      };
    });
  }
};

const findMinMaxBatchSize = (
  isMax: boolean,
  currentBatchSize: BatchSize,
  previousBatchSize?: BatchSize
): BatchSize | undefined => {
  switch (isMax) {
    case true:
      return previousBatchSize && currentBatchSize.size > previousBatchSize.size
        ? currentBatchSize
        : previousBatchSize;

    case false:
      return previousBatchSize && currentBatchSize.size < previousBatchSize.size
        ? currentBatchSize
        : previousBatchSize;

    default:
      return;
  }
};

produceOrder(products, batchSizes, productBatchSizes, batchQuantities, false);
