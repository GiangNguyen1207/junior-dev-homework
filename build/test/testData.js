"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockedOrderUseMin = exports.mockedOrderUseMax = exports.mockedBatchTable = exports.mockedBatchQuantities = exports.mockedProductBatchSizes = exports.mockedBatchSizes = exports.mockedProducts = void 0;
exports.mockedProducts = [
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
    {
        code: 'P6',
        name: 'Egg',
        price: 1.5,
    },
    {
        code: 'P7',
        name: 'Butter',
        price: 2.79,
    },
    {
        code: 'P8',
        name: 'Flour',
        price: 2.1,
    },
];
exports.mockedBatchSizes = [
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
    {
        code: 'BS8',
        size: 40,
    },
    {
        code: 'BS9',
        size: -60,
    },
    {
        code: 'BS10',
        size: 50,
    },
];
exports.mockedProductBatchSizes = [
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
        productCode: 'P6',
        batchSizeCode: 'BS8',
    },
    {
        productCode: 'P6',
        batchSizeCode: 'BS9',
    },
    {
        productCode: 'P6',
        batchSizeCode: 'BS10',
    },
    {
        productCode: 'P7',
        batchSizeCode: 'BS9',
    },
    {
        productCode: 'P8',
        batchSizeCode: 'BS11',
    },
];
exports.mockedBatchQuantities = [
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
    {
        productCode: 'P6',
        quantity: -100,
    },
    {
        productCode: 'P7',
        quantity: 200,
    },
    {
        productCode: 'P8',
        quantity: -20,
    },
];
exports.mockedBatchTable = {
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
    P6: {
        min: {
            code: 'BS8',
            size: 40,
        },
        max: {
            code: 'BS10',
            size: 50,
        },
        batchQuantity: undefined,
    },
    P7: {
        batchQuantity: 200,
    },
    P8: {
        batchQuantity: undefined,
    },
};
exports.mockedOrderUseMax = [
    {
        productCode: 'P1',
        productName: 'Milk',
        batchSizeCode: 'BS6',
        batchSize: 20,
        numberOfBatches: 20,
        price: 1.99,
    },
    {
        productCode: 'P2',
        productName: 'Sour Milk',
        batchSizeCode: 'BS3',
        batchSize: 40,
        numberOfBatches: 500,
        price: 2.05,
    },
    {
        productCode: 'P3',
        productName: 'Cream',
        batchSizeCode: 'BS5',
        batchSize: 100,
        numberOfBatches: 40,
        price: 3.59,
    },
    {
        productCode: 'P4',
        productName: 'Yoghurt',
        batchSizeCode: 'BS_GENERATED_P4',
        batchSize: 1,
        numberOfBatches: 234,
        price: 4.99,
    },
    {
        productCode: 'P5',
        productName: 'Buttermilk',
        batchSizeCode: 'BS7',
        batchSize: 50,
        numberOfBatches: 1,
        price: 3.1,
    },
    {
        productCode: 'P6',
        productName: 'Egg',
        batchSizeCode: 'BS10',
        batchSize: 50,
        numberOfBatches: 1,
        price: 1.5,
    },
    {
        productCode: 'P7',
        productName: 'Butter',
        batchSizeCode: 'BS_GENERATED_P7',
        batchSize: 1,
        numberOfBatches: 200,
        price: 2.79,
    },
    {
        productCode: 'P8',
        productName: 'Flour',
        batchSizeCode: 'BS_GENERATED_P8',
        batchSize: 1,
        numberOfBatches: 1,
        price: 2.1,
    },
];
exports.mockedOrderUseMin = [
    {
        productCode: 'P1',
        productName: 'Milk',
        batchSizeCode: 'BS6',
        batchSize: 20,
        numberOfBatches: 20,
        price: 1.99,
    },
    {
        productCode: 'P2',
        productName: 'Sour Milk',
        batchSizeCode: 'BS1',
        batchSize: 20,
        numberOfBatches: 500,
        price: 2.05,
    },
    {
        productCode: 'P3',
        productName: 'Cream',
        batchSizeCode: 'BS4',
        batchSize: 50,
        numberOfBatches: 40,
        price: 3.59,
    },
    {
        productCode: 'P4',
        productName: 'Yoghurt',
        batchSizeCode: 'BS_GENERATED_P4',
        batchSize: 1,
        numberOfBatches: 234,
        price: 4.99,
    },
    {
        productCode: 'P5',
        productName: 'Buttermilk',
        batchSizeCode: 'BS7',
        batchSize: 50,
        numberOfBatches: 1,
        price: 3.1,
    },
    {
        productCode: 'P6',
        productName: 'Egg',
        batchSizeCode: 'BS8',
        batchSize: 40,
        numberOfBatches: 1,
        price: 1.5,
    },
    {
        productCode: 'P7',
        productName: 'Butter',
        batchSizeCode: 'BS_GENERATED_P7',
        batchSize: 1,
        numberOfBatches: 200,
        price: 2.79,
    },
    {
        productCode: 'P8',
        productName: 'Flour',
        batchSizeCode: 'BS_GENERATED_P8',
        batchSize: 1,
        numberOfBatches: 1,
        price: 2.1,
    },
];
