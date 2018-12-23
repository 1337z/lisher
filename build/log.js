"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const boxen = require("boxen");
const infoColor = chalk_1.default.yellowBright;
const successColor = chalk_1.default.yellow;
const debugInfoColor = chalk_1.default.whiteBright;
exports.log = console.log;
exports.info = (message) => {
    exports.log(infoColor(message));
};
exports.success = (message) => {
    exports.log(successColor(message));
};
exports.debugInfo = (message) => {
    exports.log(debugInfoColor(message));
};
exports.boxMessageSuccess = (message, center = false) => {
    if (!center)
        exports.success(boxen(message, { float: "left", borderStyle: "round" }));
    else
        exports.success(boxen(message, { float: "center", borderStyle: "round" }));
    exports.log("");
};
exports.boxMessage = (message, color, center = false) => {
    if (!center)
        console.log(color(boxen(message, { float: "left", borderStyle: "round" })));
    else
        console.log(color(boxen(message, { float: "center", borderStyle: "round" })));
};
exports.boxMessageResult = (message, color, center = false) => {
    if (!center)
        console.log(color(boxen(message, { float: "left", padding: 1, borderStyle: "round" })));
    else
        console.log(color(boxen(message, { float: "center", padding: 1, borderStyle: "round" })));
    exports.log("");
};
