// Imports (import everything from X)
import * as choiceNames from "./choiceNames" // List of publisher names displayed in lisher
import * as inquirer from "inquirer" // CLI questions: https://www.npmjs.com/package/inquirer
import * as jsonHelper from "./utils/jsonHelper" // Get JSON from File
import * as targetModule from "./targetModule" // Information about the user selected project
import * as terminal from "./utils/terminal" // Exec commands in user terminal

// Imports
import { info, log, boxMessageSuccess, boxMessageResult } from "./log" // Logger
import { setDebuggerEnabled } from "./utils/debug" // Debugger
import chalk from "chalk" // Colored terminal output

// Global variables
export let argv: any // Yargs: https://www.npmjs.com/package/yargs-parser
export let avaiblePublishProviders: Array<object> = [] // Array with all possible/detected publish providers
export let debugStatus = false // Debug status
export let oldTargetModuleVersion: string // Version of user selected module
export let targetModuleInfo: any = {} // Information about the user selected project

// Set information about the target module (if 'package.json' is found)
if (targetModule.isNPM()) {
  targetModuleInfo = jsonHelper.fromFile("package.json")
  oldTargetModuleVersion = targetModuleInfo.version
  choiceNames.setOldTargetModuleVersion(oldTargetModuleVersion)
}

/**
 * Initial function
 * @param _argv CLI arguments => yargs
 */
export const run = async (_argv: any) => {
  argv = _argv
  debugStatus = argv.debug

  setDebuggerEnabled(debugStatus)

  // Check for unstaged changes
  if (targetModule.isGIT()) {
    let unstagedFiles = terminal.execRaw("git diff --name-only").toString()
    unstagedFiles += terminal.execRaw("git ls-files --others --exclude-standard").toString()
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
                info("Committing changes..")
                terminal.exec("git add *")
                terminal.exec(`git commit -m "${answers.commit_message}"`)
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
      message: `Please select where we should publish your module (${targetModuleInfo.name || "could not get name"}).\n`,
      choices: avaiblePublishProviders
    },
    // Ask for the version increase if a package.json is detected
    {
      type: "list",
      name: "version",
      message: "Is your publication a patch, a minor or a major change?\n",
      choices: [
        choiceNames.patch(),
        choiceNames.minor(),
        choiceNames.major(),
        new inquirer.Separator(),
        choiceNames.prePatch(),
        choiceNames.preMinor(),
        choiceNames.preMajor(),
        choiceNames.preRelease(),
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
        terminal.exec("grunt")
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
              terminal.exec("git add *")
              terminal.exec(`git commit -m "${answers.commit_message}"`)
            })
            .catch(err => {
              if (err) throw err
            })
        }
      }

      // Inform about version change
      if (answers.version != "Don't change the version") info(`Increasing the version (${answers.version})`)

      // Version the 'package.json'
      if (answers.version == choiceNames.patch()) terminal.exec("npm version patch")
      if (answers.version == choiceNames.minor()) terminal.exec("npm version minor")
      if (answers.version == choiceNames.major()) terminal.exec("npm version major")
      if (answers.version == choiceNames.prePatch()) terminal.exec("npm version prepatch")
      if (answers.version == choiceNames.preMinor()) terminal.exec("npm version preminor")
      if (answers.version == choiceNames.preMajor()) terminal.exec("npm version premajor")
      if (answers.version == choiceNames.preRelease()) terminal.exec("npm version prerelease")

      // Array of finished publish providers
      let published = []

      // Publish to NPM
      if (publishToNPM) {
        info("Publishing to NPM..")
        terminal.exec("npm publish")
        published.push("NPM")
        boxMessageSuccess("Published to NPM!")
      }

      // Publish to Visual Studio Code Marketplace
      if (publishToVSCE) {
        info("Publishing to the Visual Studio Code Marketplace..")
        terminal.exec("vsce publish")
        published.push("VSCE")
        boxMessageSuccess("Published to Visual Studio Code Marketplace!")
      }

      // If lisher was run in debug mode
      if (publishToDEBUG) {
        published.push("DEBUG")
        boxMessageSuccess("'Published' to debug!")
      }

      // Publish to git repository (Last step!)
      if (publishToGIT) {
        info("Pushing to git repository..")
        terminal.exec("git push --follow-tags")
        published.push("GIT")
        boxMessageSuccess("Pushed to git repository!")
      }

      // Create result message
      let resultMessage = ""
      resultMessage += `Published module to: ${published.toString()}`
      if (targetModule.isNPM()) resultMessage += "\n" + `Version: ${oldTargetModuleVersion} => ${jsonHelper.fromFile("package.json").version} | ${answers.version.split(" ")[0]}`

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
