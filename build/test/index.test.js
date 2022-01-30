"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
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
describe('find number of batches', function () {
    test('should return correct number of batchs', function () {
        var batchQuantities = [
            {
                productCode: 'P1',
                quantity: 100,
            },
        ];
        var numberOfBatch = (0, src_1.findBatchQuantity)(batchQuantities, 'P1');
        expect(numberOfBatch).toEqual(100);
    });
    test('should return undefined when number of batch < 0', function () {
        var batchQuantities = [
            {
                productCode: 'P1',
                quantity: -100,
            },
        ];
        var numberOfBatch = (0, src_1.findBatchQuantity)(batchQuantities, 'P1');
        expect(numberOfBatch).toEqual(undefined);
    });
    test('should return undefined when there is no batch found', function () {
        var batchQuantities = [
            {
                productCode: 'P1',
                quantity: 100,
            },
        ];
        var numberOfBatch = (0, src_1.findBatchQuantity)(batchQuantities, 'P2');
        expect(numberOfBatch).toEqual(undefined);
    });
});
describe('create batch table', function () {
    test('create batch table with enough information', function () {
        var returnedBatchTable = (0, src_1.createBatchTable)(testData_1.mockedBatchSizes, testData_1.mockedProductBatchSizes, testData_1.mockedBatchQuantities);
        expect(returnedBatchTable).toEqual(testData_1.mockedBatchTable);
    });
    test('should skip to next round when there is batch code that can not be found in the table', function () {
        var returnedBatchTable = (0, src_1.createBatchTable)(testData_1.mockedBatchSizes, testData_1.mockedProductBatchSizes, testData_1.mockedBatchQuantities);
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
    test('should return undefined when the number of batch < 0', function () {
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
            {
                productCode: 'P2',
                quantity: -200,
            },
        ];
        var returnedBatchTable = (0, src_1.createBatchTable)(batchSizes, productBatchSizes, batchQuantities);
        expect(returnedBatchTable['P1'].batchQuantity).toEqual(100);
        expect(returnedBatchTable['P2'].batchQuantity).toEqual(undefined);
    });
    test('should return undefined when the batch is not in product batch sizes and the number of batch < 0 a', function () {
        var productBatchSizes = [
            {
                productCode: 'P1',
                batchSizeCode: 'A1',
            },
        ];
        var batchSizes = [
            {
                code: 'A1',
                size: 10,
            },
        ];
        var batchQuantities = [
            {
                productCode: 'P1',
                quantity: 100,
            },
            {
                productCode: 'P2',
                quantity: -200,
            },
        ];
        var returnedBatchTable = (0, src_1.createBatchTable)(batchSizes, productBatchSizes, batchQuantities);
        expect(returnedBatchTable['P1'].batchQuantity).toEqual(100);
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
    test('should return {} when Batch Sizes is empty', function () {
        var returnedBatchTable = (0, src_1.createBatchTable)([], testData_1.mockedProductBatchSizes, testData_1.mockedBatchQuantities);
        expect(returnedBatchTable).toEqual({});
    });
    test('should return {} when Product Batch Sizes is empty', function () {
        var returnedBatchTable = (0, src_1.createBatchTable)(testData_1.mockedBatchSizes, [], testData_1.mockedBatchQuantities);
        expect(returnedBatchTable).toEqual({});
    });
    test('should return {} when Batch Quantities is empty', function () {
        var returnedBatchTable = (0, src_1.createBatchTable)(testData_1.mockedBatchSizes, testData_1.mockedProductBatchSizes, []);
        expect(returnedBatchTable).toEqual({});
    });
});
describe('create orders', function () {
    test('should take the value from column max when useMax is true', function () {
        var orders = (0, src_1.createOrders)(testData_1.mockedProducts, testData_1.mockedBatchTable, true);
        expect(orders[1]).toHaveProperty('batchSizeCode', 'BS3');
        expect(orders[1]).toHaveProperty('batchSize', 40);
        expect(orders[2]).toHaveProperty('batchSizeCode', 'BS5');
        expect(orders[2]).toHaveProperty('batchSize', 100);
    });
    test('should take the value from column min when useMax is false', function () {
        var orders = (0, src_1.createOrders)(testData_1.mockedProducts, testData_1.mockedBatchTable, false);
        expect(orders[1]).toHaveProperty('batchSizeCode', 'BS1');
        expect(orders[1]).toHaveProperty('batchSize', 20);
        expect(orders[2]).toHaveProperty('batchSizeCode', 'BS4');
        expect(orders[2]).toHaveProperty('batchSize', 50);
    });
    test('should return the default batch code/batch size when there is no batch code from batch table and useMax is true', function () {
        var products = [
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
        ];
        var batchTable = {
            P1: {
                min: {
                    code: 'A1',
                    size: 10,
                },
                max: {
                    code: 'A2',
                    size: 20,
                },
                batchQuantity: 20,
            },
            P2: {
                batchQuantity: 200,
            },
        };
        var orders = (0, src_1.createOrders)(products, batchTable, true);
        expect(orders[1]).toHaveProperty('batchSizeCode', 'BS_GENERATED_P2');
        expect(orders[1]).toHaveProperty('batchSize', 1);
        expect(orders[0]).toHaveProperty('batchSizeCode', 'A2');
        expect(orders[0]).toHaveProperty('batchSize', 20);
    });
    test('should return the default batch code/batch size when there is no batch size from batch table and useMax is false', function () {
        var products = [
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
        ];
        var batchTable = {
            P1: {
                min: {
                    code: 'A1',
                    size: 10,
                },
                max: {
                    code: 'A2',
                    size: 20,
                },
                batchQuantity: 20,
            },
            P2: {
                batchQuantity: 200,
            },
        };
        var orders = (0, src_1.createOrders)(products, batchTable, false);
        expect(orders[1]).toHaveProperty('batchSizeCode', 'BS_GENERATED_P2');
        expect(orders[1]).toHaveProperty('batchSize', 1);
        expect(orders[0]).toHaveProperty('batchSizeCode', 'A1');
        expect(orders[0]).toHaveProperty('batchSize', 10);
    });
    test('should return 1 when number of batches from batch table is undefined', function () {
        var products = [
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
        ];
        var batchTable = {
            P1: {
                min: {
                    code: 'A1',
                    size: 10,
                },
                max: {
                    code: 'A2',
                    size: 20,
                },
                batchQuantity: undefined,
            },
            P2: {
                batchQuantity: 200,
            },
        };
        var orders = (0, src_1.createOrders)(products, batchTable, true);
        expect(orders.find(function (order) { return order.productCode === 'P1'; })).toHaveProperty('numberOfBatches', 1);
        expect(orders.find(function (order) { return order.productCode === 'P2'; })).toHaveProperty('numberOfBatches', 200);
    });
});
describe('produce orders', function () {
    test('should return right orders when useMax is true', function () {
        var orders = (0, src_1.produceOrder)(testData_1.mockedProducts, testData_1.mockedBatchSizes, testData_1.mockedProductBatchSizes, testData_1.mockedBatchQuantities, true);
        expect(orders).toEqual(testData_1.mockedOrderUseMax);
    });
    test('should return right orders when useMax is false', function () {
        var orders = (0, src_1.produceOrder)(testData_1.mockedProducts, testData_1.mockedBatchSizes, testData_1.mockedProductBatchSizes, testData_1.mockedBatchQuantities, false);
        expect(orders).toEqual(testData_1.mockedOrderUseMin);
    });
    test('xyz', function () {
        var orders = (0, src_1.produceOrder)(testData_1.mockedProducts, [], testData_1.mockedProductBatchSizes, testData_1.mockedBatchQuantities, false);
        expect(orders).toEqual('Insufficient data');
    });
});
