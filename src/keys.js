"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyCodeToDeltaSpeed = function (keyCode) {
    switch (keyCode) {
        case 38:
            return 1;
        case 40:
            return -1;
        default:
            return 0;
    }
};
exports.keyCodeToDeltaAngle = function (keyCode) {
    switch (keyCode) {
        case 37:
            return -1;
        case 39:
            return 1;
        default:
            return 0;
    }
};
