import { Product, BatchSize, ProductBatchSize, BatchQuantity } from './type';

export const products: Product[] = [
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
  {
    code: 'P3',
    name: 'Cream',
    price: 3.59,
  },
  {
    code: 'P4',
    name: 'Yoghurt',
    price: 4.99,
  },
  {
    code: 'P5',
    name: 'Buttermilk',
    price: 3.1,
  },
];

export const batchSizes: BatchSize[] = [
  {
    code: 'BS1',
    size: 20,
  },
  {
    code: 'BS2',
    size: 30,
  },
  {
    code: 'BS3',
    size: 40,
  },
  {
    code: 'BS4',
    size: 50,
  },
  {
    code: 'BS5',
    size: 100,
  },
  {
    code: 'BS6',
    size: 20,
  },
  {
    code: 'BS7',
    size: 50,
  },
];

export const productBatchSizes: ProductBatchSize[] = [
  {
    productCode: 'P1',
    batchSizeCode: 'BS6',
  },
  {
    productCode: 'P2',
    batchSizeCode: 'BS1',
  },
  {
    productCode: 'P2',
    batchSizeCode: 'BS2',
  },
  {
    productCode: 'P2',
    batchSizeCode: 'BS3',
  },
  {
    productCode: 'P3',
    batchSizeCode: 'BS4',
  },
  {
    productCode: 'P3',
    batchSizeCode: 'BS5',
  },
  {
    productCode: 'P5',
    batchSizeCode: 'BS7',
  },
  {
    productCode: 'P5',
    batchSizeCode: 'BS8',
  },
];

export const batchQuantities: BatchQuantity[] = [
  {
    productCode: 'P1',
    quantity: 20,
  },
  {
    productCode: 'P2',
    quantity: 500,
  },
  {
    productCode: 'P3',
    quantity: 40,
  },
  {
    productCode: 'P4',
    quantity: 234,
  },
];
