"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const boxen = require("boxen");
const infoColor = chalk_1.default.magentaBright;
const successColor = chalk_1.default.greenBright;
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
exports.boxMessageSuccess = (message) => {
    exports.success(boxen(message, { float: "left", borderStyle: "round" }));
};
exports.boxMessage = (message, color) => {
    console.log(color(boxen(message, { float: "left", borderStyle: "round" })));
};
