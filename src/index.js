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
const inquirer = __importStar(require("inquirer"))
const child_process_1 = require("child_process")
const chalk_1 = __importDefault(require("chalk"))
const isGit = require("is-git-repository")
const log = console.log
const info = chalk_1.default.magenta
let args
exports.run = _args => {
  args = _args
  flow()
}
function flow() {
  let questions = [
    // Only ask this question when a git repository is detected
    {
      type: "checkbox",
      name: "provider",
      message: "Please select where we should publish your module.",
      choices: [{ name: "NPM" }, { name: "GIT" }],
      when: () => {
        return isGit()
      }
    },
    // Only ask this question if no git repository is detected
    {
      type: "checkbox",
      name: "provider",
      message: "Please select where we should publish your module.",
      choices: [{ name: "NPM" }],
      when: () => {
        return !isGit()
      }
    },
    // Ask for the version increase
    {
      type: "list",
      name: "version",
      message: "Is your publication a patch, a minor or a major change?",
      choices: ["PATCH", "MINOR", "MAJOR", "Don't change the version"]
    }
  ]
  inquirer.prompt(questions).then(answers => {
    if (answers.version != "Don't change the version") log(info(`Increasing the version (${answers.version})`))
    if (answers.version == "PATCH") exec("npm version patch")
    if (answers.version == "MINOR") exec("npm version minor")
    if (answers.version == "MAJOR") exec("npm version major")
    if (answers.provider.indexOf("NPM") > -1) {
      log(info("Publishing to NPM.."))
      exec("npm publish")
    }
    if (answers.provider.indexOf("GIT") > -1) {
      log(info("Pushing to git.."))
      exec("git push --follow-tags")
    }
  })
}
const exec = command => {
  child_process_1.execSync(command, { stdio: [process.stdin, process.stdout, process.stderr] })
}
