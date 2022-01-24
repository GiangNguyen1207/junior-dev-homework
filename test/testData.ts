import { BatchTable } from '../src/type';

export const expectedBatchTable: BatchTable = {
  P1: {
    min: {
      code: 'BS6',
      size: 20,
    },
    max: {
      code: 'BS6',
      size: 20,
    },
    batchQuantity: 20,
  },
  P2: {
    min: {
      code: 'BS1',
      size: 20,
    },
    max: {
      code: 'BS3',
      size: 40,
    },
    batchQuantity: 500,
  },
  P3: {
    min: {
      code: 'BS4',
      size: 50,
    },
    max: {
      code: 'BS5',
      size: 100,
    },
    batchQuantity: 40,
  },
  P4: {
    batchQuantity: 234,
  },
  P5: {
    min: {
      code: 'BS7',
      size: 50,
    },
    max: {
      code: 'BS7',
      size: 50,
    },
    batchQuantity: undefined,
  },
};
