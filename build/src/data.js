"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchQuantities = exports.productBatchSizes = exports.batchSizes = exports.products = void 0;
exports.products = [
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
exports.batchSizes = [
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
exports.productBatchSizes = [
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
exports.batchQuantities = [
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
