"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
exports.isGIT = () => {
    return fs.existsSync(".git");
};
exports.isNPM = () => {
    return fs.existsSync("package.json");
};
exports.isVSCE = () => {
    if (fs.existsSync("package.json") && fs.existsSync("node_modules/vscode"))
        return true;
    else
        return false;
};
exports.isGRUNT = () => {
    if (fs.existsSync("Gruntfile.js") || fs.existsSync("Gruntfile.coffee"))
        return true;
    else
        return false;
};
