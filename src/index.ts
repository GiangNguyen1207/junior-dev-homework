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
  //console.log(batchTable);

  //2. create orders
  return createOrders(products, batchTable, useMax);
};

export const createOrders = (
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
      numberOfBatches: batchTable[product.code].batchQuantity ?? 1,
      price: product.price,
    };
    orders.push(order);
  });
  //console.log(orders);
  return orders;
};

export const createBatchTable = (
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
    let batchInformation: BatchInformation = {};

    const quantity = batchQuantities.find(
      (quantity) => quantity.productCode === productCode
    )?.quantity;

    if (batchFound) {
      if (batchFound.size > 0) {
        batchInformation.min = batchTable[productCode]
          ? findMinMaxBatchSize(false, batchFound, batchTable[productCode].min)
          : batchFound;
        batchInformation.max = batchTable[productCode]
          ? findMinMaxBatchSize(true, batchFound, batchTable[productCode].max)
          : batchFound;
        batchInformation.batchQuantity =
          quantity && quantity > 0 ? quantity : undefined;
      } else return;
    } else return;

    batchTable[productCode] = batchInformation;
  });

  const unavailableBatches = batchQuantities.filter(
    (batch) => !Object.keys(batchTable).includes(batch.productCode)
  );
  if (unavailableBatches.length > 0) {
    unavailableBatches.forEach((batch) => {
      batchTable[batch.productCode] = {
        batchQuantity: batchQuantities.find(
          (quantity) => quantity.productCode === batch.productCode
        )?.quantity,
      };
    });
  }

  return batchTable;
};

export const findMinMaxBatchSize = (
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
