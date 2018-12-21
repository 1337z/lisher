"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const log_1 = require("../log/log")
let active = false
exports.setDebuggerEnabled = enabled => {
  active = enabled
  if (enabled) log_1.debugInfo("Debug mode enabled!")
}
exports.debugTime = (...args) => {
  if (active) return console.time(args)
}
exports.debugTimeEnd = (...args) => {
  if (active) return console.timeEnd(...args)
}
exports.debugLogTime = () => {
  if (active) return console.timeLog
}
exports.debugMessage = message => {
  if (active) log_1.debugInfo(message)
}
