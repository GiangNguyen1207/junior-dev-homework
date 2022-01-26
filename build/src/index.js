"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMinMaxBatchSize = exports.findBatchQuantity = exports.createBatchTable = exports.createOrders = exports.produceOrder = void 0;
var data_1 = require("./data");
var produceOrder = function (products, batchSizes, productBatchSizes, batchQuantities, useMax) {
    var batchTable = (0, exports.createBatchTable)(batchSizes, productBatchSizes, batchQuantities);
    return (0, exports.createOrders)(products, batchTable, useMax);
};
exports.produceOrder = produceOrder;
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
    return orders;
};
exports.createOrders = createOrders;
var createBatchTable = function (batchSizes, productBatchSizes, batchQuantities) {
    var batchTable = {};
    productBatchSizes.forEach(function (productBatchSize) {
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
                batchInformation.batchQuantity = (0, exports.findBatchQuantity)(batchQuantities, productCode);
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
            batchTable[batch.productCode] = {
                batchQuantity: (0, exports.findBatchQuantity)(batchQuantities, batch.productCode),
            };
        });
    }
    return batchTable;
};
exports.createBatchTable = createBatchTable;
var findBatchQuantity = function (batchQuantities, productCode) {
    var _a;
    var quantity = (_a = batchQuantities.find(function (quantity) { return quantity.productCode === productCode; })) === null || _a === void 0 ? void 0 : _a.quantity;
    return quantity && quantity > 0 ? quantity : undefined;
};
exports.findBatchQuantity = findBatchQuantity;
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
console.log('when using max batch sizes', (0, exports.produceOrder)(data_1.products, data_1.batchSizes, data_1.productBatchSizes, data_1.batchQuantities, true));
console.log('when using min batch sizes', (0, exports.produceOrder)(data_1.products, data_1.batchSizes, data_1.productBatchSizes, data_1.batchQuantities, false));
