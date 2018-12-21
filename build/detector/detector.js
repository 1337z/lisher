"use strict"
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k]
    result["default"] = mod
    return result
  }
Object.defineProperty(exports, "__esModule", { value: true })
var fs = __importStar(require("fs"))
exports.isGit = function() {
  return fs.existsSync(".git")
}
exports.isNPM = function() {
  return fs.existsSync("package.json")
}
exports.isVSCE = function() {
  if (fs.existsSync("package.json") && fs.existsSync("node_modules/vscode")) return true
  else return false
}
