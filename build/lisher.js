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
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, "__esModule", { value: true })
var inquirer = __importStar(require("inquirer"))
var chalk_1 = __importDefault(require("chalk"))
var child_process_1 = require("child_process")
var detector_1 = require("./detector/detector")
var log = console.log
var info = chalk_1.default.magentaBright
var args
var providers = []
exports.run = function(_args) {
  args = _args
  flow()
}
var flow = function() {
  if (detector_1.isGit()) registerProvider("GIT")
  if (detector_1.isNPM()) registerProvider("NPM")
  if (detector_1.isVSCE()) registerProvider("VSCE")
  var questions = [
    {
      type: "checkbox",
      name: "provider",
      message: "Please select where we should publish your module.\n",
      choices: providers,
      when: function() {
        return detector_1.isGit
      }
    },
    {
      type: "list",
      name: "version",
      message: "Is your publication a patch, a minor or a major change?",
      choices: ["PATCH", "MINOR", "MAJOR", "Don't change the version"],
      when: function() {
        return detector_1.isNPM
      }
    }
  ]
  inquirer
    .prompt(questions)
    .then(function(answers) {
      var publishToGIT = answers.provider.indexOf("GIT") > -1
      var publishToNPM = answers.provider.indexOf("NPM") > -1
      var publishToVSCE = answers.provider.indexOf("VSCE") > -1
      if (detector_1.isGit()) {
        var unstagedFiles = child_process_1.execSync("git diff --name-only").toString()
        if (unstagedFiles) {
          log(info("Git working directory not clean!\nPlease commit your changes before publishing."))
          log(unstagedFiles)
          log(info("Aborting."))
          throw Error("Git working directory not clean.")
        }
      }
      if (answers.version != "Don't change the version") log(info("Increasing the version (" + answers.version + ")"))
      if (answers.version == "PATCH") exec("npm version patch")
      if (answers.version == "MINOR") exec("npm version minor")
      if (answers.version == "MAJOR") exec("npm version major")
      if (publishToNPM) {
        log(info("Publishing to NPM.."))
        exec("npm publish")
      }
      if (publishToVSCE) {
        log(info("Publishing to the Visual Studio Code Marketplace.."))
        exec("vsce publish")
      }
      if (publishToGIT) {
        log(info("Pushing to git repository.."))
        exec("git push --follow-tags")
      }
    })
    .catch(function(err) {})
}
var exec = function(command) {
  child_process_1.execSync(command, { stdio: [process.stdin, process.stdout, process.stderr] })
}
var registerProvider = function(provider) {
  providers.push({ name: provider })
}
