"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMinMaxBatchSize = exports.createBatchTable = void 0;
var data_1 = require("./data");
var produceOrder = function (products, batchSizes, productBatchSizes, batchQuantities, useMax) {
    //1. create Batch Table
    var batchTable = (0, exports.createBatchTable)(batchSizes, productBatchSizes, batchQuantities);
    //console.log(batchTable);
    //2. create orders
    return createOrders(products, batchTable, useMax);
};
var createOrders = function (products, batchTable, useMax) {
    var orders = [];
    products.forEach(function (product) {
        var _a, _b, _c, _d, _e;
        var defaultBatchSize = {
            code: "BS_GENERATED_".concat(product.code),
            size: 1,
        };
        var order = {
            productCode: product.code,
            productName: product.name,
            batchSizeCode: (useMax
                ? (_a = batchTable[product.code].max) === null || _a === void 0 ? void 0 : _a.code
                : (_b = batchTable[product.code].min) === null || _b === void 0 ? void 0 : _b.code) || defaultBatchSize.code,
            batchSize: (useMax
                ? (_c = batchTable[product.code].max) === null || _c === void 0 ? void 0 : _c.size
                : (_d = batchTable[product.code].min) === null || _d === void 0 ? void 0 : _d.size) || defaultBatchSize.size,
            numberOfBatches: (_e = batchTable[product.code].batchQuantity) !== null && _e !== void 0 ? _e : 1,
            price: product.price,
        };
        orders.push(order);
    });
    //console.log(orders);
    return orders;
};
var createBatchTable = function (batchSizes, productBatchSizes, batchQuantities) {
    var batchTable = {};
    productBatchSizes.forEach(function (productBatchSize) {
        var _a;
        var productCode = productBatchSize.productCode;
        var batchFound = batchSizes.find(function (batch) { return batch.code === productBatchSize.batchSizeCode; });
        var batchInformation = {};
        if (batchFound) {
            if (batchFound.size > 0) {
                batchInformation.min = batchTable[productCode]
                    ? (0, exports.findMinMaxBatchSize)(false, batchFound, batchTable[productCode].min)
                    : batchFound;
                batchInformation.max = batchTable[productCode]
                    ? (0, exports.findMinMaxBatchSize)(true, batchFound, batchTable[productCode].max)
                    : batchFound;
                batchInformation.batchQuantity = (_a = batchQuantities.find(function (quantity) { return quantity.productCode === productCode; })) === null || _a === void 0 ? void 0 : _a.quantity;
            }
            else
                return;
        }
        else
            return;
        batchTable[productCode] = batchInformation;
    });
    var unavailableBatches = batchQuantities.filter(function (batch) { return !Object.keys(batchTable).includes(batch.productCode); });
    if (unavailableBatches.length > 0) {
        unavailableBatches.forEach(function (batch) {
            var _a;
            batchTable[batch.productCode] = {
                batchQuantity: (_a = batchQuantities.find(function (quantity) { return quantity.productCode === batch.productCode; })) === null || _a === void 0 ? void 0 : _a.quantity,
            };
        });
    }
    return batchTable;
};
exports.createBatchTable = createBatchTable;
var findMinMaxBatchSize = function (isMax, currentBatchSize, previousBatchSize) {
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
exports.findMinMaxBatchSize = findMinMaxBatchSize;
produceOrder(data_1.products, data_1.batchSizes, data_1.productBatchSizes, data_1.batchQuantities, false);
