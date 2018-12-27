// Imports
import * as inquirer from "inquirer"
import * as fs from "fs"
import * as targetModule from "./targetModule"
import { info, log, boxMessage, boxMessageSuccess, boxMessageResult } from "./log"
import { exec, execRaw } from "./utils/exec"
import { setDebuggerEnabled, debugMessage } from "./utils/debug"
import chalk from "chalk"

// Requires (modules with no, or buggy, TypeScript support)
const semver = require("semver")

// Global variables
export let argv: any // Yargs
export let debugStatus = false //Debug status
export let avaiblePublishProviders: Array<object> = []
export let targetModuleInfo: any

if (targetModule.isNPM()) targetModuleInfo = JSON.parse(fs.readFileSync("package.json").toString())

export let oldTargetModuleVersion: string

if (targetModule.isNPM()) oldTargetModuleVersion = targetModuleInfo.version

// Inital function
export const run = async (_argv: any) => {
  argv = _argv
  debugStatus = argv.debug

  setDebuggerEnabled(debugStatus)

  // Check for unstaged changes
  if (targetModule.isGIT()) {
    let unstagedFiles = execRaw("git diff --name-only").toString()
    unstagedFiles += execRaw("git ls-files --others --exclude-standard").toString()
    if (unstagedFiles) {
      info("Git working directory not clean!\nPlease commit your changes before publishing.")
      log(unstagedFiles)

      await inquirer
        .prompt([
          {
            type: "confirm",
            name: "commit_changes",
            message: "Do you want to write a quick commit message and continue?"
          }
        ])
        .then(async (answers: any) => {
          if (answers.commit_changes) {
            await inquirer
              .prompt([
                {
                  type: "input",
                  name: "commit_message",
                  message: "Please enter the commit message"
                }
              ])
              .then((answers: any) => {
                info("Commiting changes..")
                exec("git add *")
                exec(`git commit -m "${answers.commit_message}"`)
                boxMessageSuccess("Commited changes!")
              })
              .catch(err => {
                if (err) throw err
              })
          } else {
            info("Please commit your changes manually and run lisher again.")
            throw Error("Git working directory not clean!")
          }
        })
        .catch(err => {
          if (err) throw err
        })
    }
  }

  if (targetModule.isGIT()) registerProvider("GIT")
  if (targetModule.isNPM()) registerProvider("NPM")
  if (targetModule.isVSCE()) registerProvider("VSCE")

  if (debugStatus) registerProvider("Debug")

  let questions: any = [
    {
      type: "confirm",
      name: "grunt",
      message: "We found a Gruntfile. Should we run Grunt?",
      when: () => {
        return targetModule.isGRUNT()
      }
    },
    {
      type: "checkbox",
      name: "provider",
      message: "Please select where we should publish your module.\n",
      choices: avaiblePublishProviders
    },
    // Ask for the version increase if a package.json is detected
    {
      type: "list",
      name: "version",
      message: "Is your publication a patch, a minor or a major change?\n",
      choices: [
        `PATCH => ${semver.inc(oldTargetModuleVersion, "patch")}`,
        `MINOR => ${semver.inc(oldTargetModuleVersion, "minor")}`,
        `MAJOR =>  ${semver.inc(oldTargetModuleVersion, "major")}`,
        new inquirer.Separator(),
        `pre-patch => ${semver.inc(oldTargetModuleVersion, "prepatch")}`,
        `pre-minor => ${semver.inc(oldTargetModuleVersion, "preminor")}`,
        `pre-major => ${semver.inc(oldTargetModuleVersion, "premajor")}`,
        `pre-release => ${semver.inc(oldTargetModuleVersion, "prerelease")}`,
        "Don't change the version"
      ],
      when: () => {
        return targetModule.isNPM()
      }
    }
  ]

  await inquirer
    .prompt(questions) // Prompt the questions
    .then(async (answers: any) => {
      // Set publish providers
      const publishToGIT: boolean = answers.provider.indexOf("GIT") > -1
      const publishToNPM: boolean = answers.provider.indexOf("NPM") > -1
      const publishToVSCE: boolean = answers.provider.indexOf("VSCE") > -1
      const publishToDEBUG: boolean = debugStatus

      const runGrunt: boolean = answers.grunt

      if (runGrunt) {
        info("Running Grunt..")
        exec("grunt")
        if (targetModule.isGIT()) {
          info("The changes made by Grunt need to be commited before publishing!")
          await inquirer
            .prompt([
              {
                type: "input",
                name: "commit_message",
                message: "Please enter the commit message"
              }
            ])
            .then((answers: any) => {
              exec("git add *")
              exec(`git commit -m "${answers.commit_message}"`)
            })
            .catch(err => {
              if (err) throw err
            })
        }
      }

      if (answers.version != "Don't change the version") info(`Increasing the version (${answers.version})`)

      // Version the 'package.json'
      if (answers.version == `PATCH => ${semver.inc(oldTargetModuleVersion, "patch")}`) exec("npm version patch")
      if (answers.version == `MINOR => ${semver.inc(oldTargetModuleVersion, "minor")}`) exec("npm version minor")
      if (answers.version == `MAJOR => ${semver.inc(oldTargetModuleVersion, "major")}`) exec("npm version major")
      if (answers.version == `pre-patch => ${semver.inc(oldTargetModuleVersion, "prepatch")}`) exec("npm version prepatch")
      if (answers.version == `pre-minor => ${semver.inc(oldTargetModuleVersion, "preminor")}`) exec("npm version preminor")
      if (answers.version == `pre-major => ${semver.inc(oldTargetModuleVersion, "premajor")}`) exec("npm version premajor")
      if (answers.version == `pre-release => ${semver.inc(oldTargetModuleVersion, "prerelease")}`) exec("npm version prerelease")

      let published = []

      // Publish to NPM
      if (publishToNPM) {
        info("Publishing to NPM..")
        exec("npm publish")
        published.push("NPM")
        boxMessageSuccess("Published to NPM!")
      }

      // Publish to Visual Studio Code Marketplace
      if (publishToVSCE) {
        info("Publishing to the Visual Studio Code Marketplace..")
        exec("vsce publish")
        published.push("VSCE")
        boxMessageSuccess("Published to Visual Studio Code Marketplace!")
      }

      if (publishToDEBUG) {
        published.push("DEBUG")
        boxMessageSuccess("'Published' to debug!")
      }

      // Publish to git repository (Last step!)
      if (publishToGIT) {
        info("Pushing to git repository..")
        exec("git push --follow-tags")
        published.push("GIT")
        boxMessageSuccess("Pushed to git repository!")
      }

      let resultMessage = ""

      resultMessage += `Published module to: ${published.toString()}`
      if (targetModule.isNPM())
        resultMessage += "\n" + `Version: ${oldTargetModuleVersion} => ${JSON.parse(fs.readFileSync("package.json").toString()).version} | ${answers.version.split(" ")[0]}`

      boxMessageResult(resultMessage, chalk.greenBright, true)
    })
    .catch(err => {
      // Throw an error if something goes wrong
      if (err) throw err
    })
}

/**
 * Register a code provider where the code should be uploaded
 * @param provider Provider to upload the code to
 */
const registerProvider = (provider: string) => {
  avaiblePublishProviders.push({ name: provider })
}
