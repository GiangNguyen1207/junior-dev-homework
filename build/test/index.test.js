"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var data_1 = require("../src/data");
var testData_1 = require("./testData");
describe('find min and max of batch size', function () {
    test('should return the smaller batch size', function () {
        var currentBatch = {
            code: 'A1',
            size: 10,
        };
        var previousBatch = {
            code: 'A2',
            size: 20,
        };
        var returnedBatch = (0, src_1.findMinMaxBatchSize)(false, currentBatch, previousBatch);
        expect(returnedBatch).toEqual(currentBatch);
        expect(returnedBatch === null || returnedBatch === void 0 ? void 0 : returnedBatch.size).toEqual(10);
    });
    test('should return the bigger batch size', function () {
        var currentBatch = {
            code: 'A1',
            size: 10,
        };
        var previousBatch = {
            code: 'A2',
            size: 20,
        };
        var returnedBatch = (0, src_1.findMinMaxBatchSize)(true, currentBatch, previousBatch);
        expect(returnedBatch).toEqual(previousBatch);
        expect(returnedBatch === null || returnedBatch === void 0 ? void 0 : returnedBatch.size).toEqual(20);
    });
    test('should return undefined when there is no previous batch', function () {
        var currentBatch = {
            code: 'A1',
            size: 10,
        };
        var returnedBatch = (0, src_1.findMinMaxBatchSize)(false, currentBatch);
        expect(returnedBatch).toEqual(undefined);
    });
});
describe('create batch table', function () {
    test('create batch table with enough information', function () {
        var returnedBatchTable = (0, src_1.createBatchTable)(data_1.batchSizes, data_1.productBatchSizes, data_1.batchQuantities);
        expect(returnedBatchTable).toEqual(testData_1.expectedBatchTable);
    });
    test('should skip to next round when there is batch code that can not be found in the table', function () {
        var returnedBatchTable = (0, src_1.createBatchTable)(data_1.batchSizes, data_1.productBatchSizes, data_1.batchQuantities);
        expect(returnedBatchTable['P5'].min).toEqual(expect.not.objectContaining({ code: 'BS8' }));
        expect(returnedBatchTable['P5'].max).toEqual(expect.not.objectContaining({ code: 'BS8' }));
    });
    test('should return same size for min and max when there is only 1 size', function () {
        var batchSizes = [
            {
                code: 'A1',
                size: 10,
            },
        ];
        var productBatchSizes = [
            {
                productCode: 'P1',
                batchSizeCode: 'A1',
            },
        ];
        var batchQuantities = [
            {
                productCode: 'P1',
                quantity: 100,
            },
        ];
        var returnedBatchTable = (0, src_1.createBatchTable)(batchSizes, productBatchSizes, batchQuantities);
        expect(returnedBatchTable).toHaveProperty('P1', {
            min: batchSizes[0],
            max: batchSizes[0],
            batchQuantity: 100,
        });
    });
    test('should return correct min and max size when there are more than 3 options for sizes', function () {
        var batchSizes = [
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
        var productBatchSizes = [
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
        var batchQuantities = [
            {
                productCode: 'P1',
                quantity: 100,
            },
        ];
        var returnedBatchTable = (0, src_1.createBatchTable)(batchSizes, productBatchSizes, batchQuantities);
        expect(returnedBatchTable).toHaveProperty('P1', {
            min: batchSizes[0],
            max: batchSizes[2],
            batchQuantity: 100,
        });
    });
    test('should not return min and max size when all the batch sizes are negative numbers', function () {
        var batchSizes = [
            {
                code: 'A1',
                size: -10,
            },
            {
                code: 'A2',
                size: -20,
            },
        ];
        var productBatchSizes = [
            {
                productCode: 'P1',
                batchSizeCode: 'A1',
            },
            {
                productCode: 'P1',
                batchSizeCode: 'A2',
            },
        ];
        var batchQuantities = [
            {
                productCode: 'P1',
                quantity: 100,
            },
        ];
        var returnedBatchTable = (0, src_1.createBatchTable)(batchSizes, productBatchSizes, batchQuantities);
        expect(returnedBatchTable['P1']).toEqual(expect.objectContaining({ batchQuantity: 100 }));
    });
    test('should not return undefined when there is one (or more) positive numbers for size', function () {
        var batchSizes = [
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
        var productBatchSizes = [
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
        var batchQuantities = [
            {
                productCode: 'P1',
                quantity: 100,
            },
        ];
        var returnedBatchTable = (0, src_1.createBatchTable)(batchSizes, productBatchSizes, batchQuantities);
        expect(returnedBatchTable['P1']).toEqual(expect.objectContaining({
            min: batchSizes[2],
            max: batchSizes[2],
            batchQuantity: 100,
        }));
    });
    test('should return undefined when there is no batch quantity found', function () {
        var productBatchSizes = [
            {
                productCode: 'P1',
                batchSizeCode: 'A1',
            },
            {
                productCode: 'P2',
                batchSizeCode: 'A2',
            },
        ];
        var batchSizes = [
            {
                code: 'A1',
                size: 10,
            },
            {
                code: 'A2',
                size: 20,
            },
        ];
        var batchQuantities = [
            {
                productCode: 'P1',
                quantity: 100,
            },
        ];
        var returnedBatchTable = (0, src_1.createBatchTable)(batchSizes, productBatchSizes, batchQuantities);
        expect(returnedBatchTable['P2'].batchQuantity).toEqual(undefined);
    });
    test('should add more products to batch table', function () {
        var batchSizes = [
            {
                code: 'A1',
                size: 10,
            },
            {
                code: 'A2',
                size: 20,
            },
        ];
        var productBatchSizes = [
            {
                productCode: 'P1',
                batchSizeCode: 'A1',
            },
            {
                productCode: 'P2',
                batchSizeCode: 'A2',
            },
        ];
        var batchQuantities = [
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
        var returnedBatchTable = (0, src_1.createBatchTable)(batchSizes, productBatchSizes, batchQuantities);
        expect(returnedBatchTable).toHaveProperty('P3');
        expect(returnedBatchTable).toHaveProperty('P4');
        expect(returnedBatchTable['P3'].batchQuantity).toEqual(300);
        expect(returnedBatchTable['P4'].batchQuantity).toEqual(400);
    });
    test('should add products to batch table when size < 0', function () {
        var batchSizes = [
            {
                code: 'A1',
                size: -10,
            },
        ];
        var productBatchSizes = [
            {
                productCode: 'P1',
                batchSizeCode: 'A1',
            },
        ];
        var batchQuantities = [
            {
                productCode: 'P1',
                quantity: 100,
            },
        ];
        var returnedBatchTable = (0, src_1.createBatchTable)(batchSizes, productBatchSizes, batchQuantities);
        expect(Object.keys(returnedBatchTable)).toHaveLength(1);
    });
    test('should not add more products to batch table', function () {
        var batchSizes = [
            {
                code: 'A1',
                size: 10,
            },
            {
                code: 'A2',
                size: 20,
            },
        ];
        var productBatchSizes = [
            {
                productCode: 'P1',
                batchSizeCode: 'A1',
            },
            {
                productCode: 'P2',
                batchSizeCode: 'A2',
            },
        ];
        var batchQuantities = [
            {
                productCode: 'P1',
                quantity: 100,
            },
            {
                productCode: 'P2',
                quantity: 200,
            },
        ];
        var returnedBatchTable = (0, src_1.createBatchTable)(batchSizes, productBatchSizes, batchQuantities);
        expect(Object.keys(returnedBatchTable)).toHaveLength(2);
    });
});
