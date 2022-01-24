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
describe('find a product with unavailable batch', function () {
    test('should return an array with 1 product and unavailable batch', function () {
        var expectedResult = [
            {
                productCode: 'P4',
                quantity: 234,
            },
        ];
        var returnedBatch = (0, src_1.findUnavailableBatch)(data_1.productBatchSizes, data_1.batchQuantities);
        expect(returnedBatch).toMatchObject(expectedResult);
    });
    test('should return an array with a list of products and unavailable batches', function () {
        var productBatchSizes = [
            {
                productCode: 'P1',
                batchSizeCode: 'A1',
            },
            {
                productCode: 'P2',
                batchSizeCode: 'A3',
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
        var expectedResult = [
            {
                productCode: 'P3',
                quantity: 300,
            },
            {
                productCode: 'P4',
                quantity: 400,
            },
        ];
        var returnedBatch = (0, src_1.findUnavailableBatch)(productBatchSizes, batchQuantities);
        expect(returnedBatch).toEqual(expect.arrayContaining(expectedResult));
    });
    test('should return an empty array if all products matches its own batch size', function () {
        var productBatchSizes = [
            {
                productCode: 'P1',
                batchSizeCode: 'A1',
            },
            {
                productCode: 'P2',
                batchSizeCode: 'A3',
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
        var returnedBatch = (0, src_1.findUnavailableBatch)(productBatchSizes, batchQuantities);
        expect(returnedBatch).toEqual([]);
    });
});
describe('create batch table', function () {
    test('create batch table with enough information', function () {
        var batchTable = (0, src_1.createBatchTable)(data_1.batchSizes, data_1.productBatchSizes, data_1.batchQuantities);
        expect(batchTable).toEqual(testData_1.expectedBatchTable);
    });
    test('should skip to next round when there is batch code that can not be found in the table', function () {
        var batchTable = (0, src_1.createBatchTable)(data_1.batchSizes, data_1.productBatchSizes, data_1.batchQuantities);
        //expect(batchTable).
    });
});
