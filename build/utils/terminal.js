"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
exports.execRaw = child_process_1.execSync;
exports.exec = (command) => {
    return child_process_1.execSync(command, { stdio: [process.stdin, process.stdout, process.stderr] });
};
