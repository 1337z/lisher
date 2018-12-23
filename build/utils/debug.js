"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../log/log");
const chalk_1 = __importDefault(require("chalk"));
let active = false;
exports.setDebuggerEnabled = (enabled) => {
    active = enabled;
    if (enabled)
        log_1.boxMessage("DEBUG MODE", chalk_1.default.yellow);
};
exports.debugTime = (...args) => {
    if (active)
        return console.time(args);
};
exports.debugTimeEnd = (...args) => {
    if (active)
        return console.timeEnd(...args);
};
exports.debugLogTime = () => {
    if (active)
        return console.timeLog;
};
exports.debugMessage = (message) => {
    if (active)
        log_1.debugInfo(message);
};
