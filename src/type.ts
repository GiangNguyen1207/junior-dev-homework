export type Product = {
  code: string;
  name: string;
  price: number;
};

export type BatchSize = {
  code: string;
  size: number;
};

export type ProductBatchSize = {
  productCode: string;
  batchSizeCode: string;
};

export type BatchQuantity = {
  productCode: string;
  quantity: number;
};

export type BatchInformation = {
  min?: BatchSize;
  max?: BatchSize;
  batchQuantiy?: number;
};

export type BatchTable = {
  [productCode: string]: BatchInformation;
};

export type Order = {
  productCode: string;
  batchSizeCode: string;
  productName: string;
  batchSize: number;
  numberOfBatches: number;
  price: number;
};
