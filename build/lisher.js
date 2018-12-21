"use strict"
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value)
            }).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
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
const inquirer = __importStar(require("inquirer"))
const log_1 = require("./log/log")
const detector_1 = require("./detector/detector")
const exec_1 = require("./utils/exec")
let argv
let debug = false
let providers = []
exports.run = _argv => {
  argv = _argv
  debug = argv.debug
  if (detector_1.isGIT()) registerProvider("GIT")
  if (detector_1.isNPM()) registerProvider("NPM")
  if (detector_1.isVSCE()) registerProvider("VSCE")
  let questions = [
    {
      type: "confirm",
      name: "grunt",
      message: "We found a Gruntfile. Should we run Grunt?",
      when: () => {
        return detector_1.isGRUNT()
      }
    },
    {
      type: "checkbox",
      name: "provider",
      message: "Please select where we should publish your module.\n",
      choices: providers
    },
    {
      type: "list",
      name: "version",
      message: "Is your publication a patch, a minor or a major change?",
      choices: ["PATCH", "MINOR", "MAJOR", "Don't change the version"],
      when: () => {
        return detector_1.isNPM()
      }
    }
  ]
  inquirer
    .prompt(questions)
    .then(answers =>
      __awaiter(this, void 0, void 0, function*() {
        const publishToGIT = answers.provider.indexOf("GIT") > -1
        const publishToNPM = answers.provider.indexOf("NPM") > -1
        const publishToVSCE = answers.provider.indexOf("VSCE") > -1
        const runGrunt = answers.grunt
        if (detector_1.isGIT()) {
          const unstagedFiles = exec_1.execRaw("git diff --name-only").toString()
          if (unstagedFiles) {
            log_1.info("Git working directory not clean!\nPlease commit your changes before publishing.")
            log_1.log(unstagedFiles)
            log_1.info("Aborting.")
            throw Error("Git working directory not clean.")
          }
        }
        if (runGrunt) {
          log_1.info("Running Grunt..")
          exec_1.exec("grunt")
          if (detector_1.isGIT()) {
            log_1.info("The changes made by Grunt need to be commited before publishing!")
            yield inquirer
              .prompt([
                {
                  type: "input",
                  name: "commit_message",
                  message: "Please enter the commit message"
                }
              ])
              .then(answers => {
                exec_1.exec("git add *")
                exec_1.exec(`git commit -m "${answers.commit_message}"`)
              })
          }
        }
        if (answers.version != "Don't change the version") log_1.info(`Increasing the version (${answers.version})`)
        if (answers.version == "PATCH") exec_1.exec("npm version patch")
        if (answers.version == "MINOR") exec_1.exec("npm version minor")
        if (answers.version == "MAJOR") exec_1.exec("npm version major")
        if (publishToNPM) {
          log_1.info("Publishing to NPM..")
          exec_1.exec("npm publish")
        }
        if (publishToVSCE) {
          log_1.info("Publishing to the Visual Studio Code Marketplace..")
          exec_1.exec("vsce publish")
        }
        if (publishToGIT) {
          log_1.info("Pushing to git repository..")
          exec_1.exec("git push --follow-tags")
        }
      })
    )
    .catch(err => {
      if (err) throw err
    })
}
const registerProvider = provider => {
  providers.push({ name: provider })
}
