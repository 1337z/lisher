import * as inquirer from "inquirer"
import { info, log } from "./log/log"
import { isGIT, isNPM, isVSCE, isGRUNT } from "./detector/detector"
import { exec, execRaw } from "./utils/exec"
import { debugTime, debugTimeEnd, setDebuggerEnabled, debugMessage } from "./utils/debug"

// Global variables
let argv: any
let debug = false
let providers: Array<object> = []

// Inital function
export const run = async (_argv: string[]) => {
  argv = _argv
  debug = argv.debug

  setDebuggerEnabled(debug)

  // Check for unstaged changes
  debugTime("Check for unstaged changes")
  if (isGIT()) {
    const unstagedFiles = execRaw("git diff --name-only").toString()
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
              })
          } else {
            info("Please commit your changes manually and run lisher again.")
            throw Error("Git working directory not clean.")
          }
        })
    }
  }
  debugTimeEnd("Check for unstaged changes")

  debugTime("Register and detect providers")
  if (isGIT()) registerProvider("GIT")
  if (isNPM()) registerProvider("NPM")
  if (isVSCE()) registerProvider("VSCE")

  if (debug) registerProvider("Debug")
  debugTimeEnd("Register and detect providers")
  debugMessage("Detected providers: " + JSON.stringify(providers))

  debugMessage("Init questions..")
  let questions: any = [
    {
      type: "confirm",
      name: "grunt",
      message: "We found a Gruntfile. Should we run Grunt?",
      when: () => {
        return isGRUNT()
      }
    },
    {
      type: "checkbox",
      name: "provider",
      message: "Please select where we should publish your module.\n",
      choices: providers
    },
    // Ask for the version increase if a package.json is detected
    {
      type: "list",
      name: "version",
      message: "Is your publication a patch, a minor or a major change?",
      choices: ["PATCH", "MINOR", "MAJOR", "Don't change the version"],
      when: () => {
        return isNPM()
      }
    }
  ]
  debugMessage("Questions initialized!")

  debugMessage("Asking questions..")
  debugTime("Questions")
  await inquirer
    .prompt(questions) // Prompt the questions
    .then(async (answers: any) => {
      debugMessage("Running app against answers..")

      // Set publish providers
      const publishToGIT: boolean = answers.provider.indexOf("GIT") > -1
      const publishToNPM: boolean = answers.provider.indexOf("NPM") > -1
      const publishToVSCE: boolean = answers.provider.indexOf("VSCE") > -1

      const runGrunt: boolean = answers.grunt

      debugTime("Run grunt")
      if (runGrunt) {
        info("Running Grunt..")
        exec("grunt")
        if (isGIT()) {
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
        }
      }
      debugTimeEnd("Run grunt")

      if (answers.version != "Don't change the version") info(`Increasing the version (${answers.version})`)

      // Version the 'package.json'
      debugTime("Set version")
      if (answers.version == "PATCH") exec("npm version patch")
      if (answers.version == "MINOR") exec("npm version minor")
      if (answers.version == "MAJOR") exec("npm version major")
      debugTimeEnd("Set version")

      // Publish to NPM
      debugTime("Publish to NPM")
      if (publishToNPM) {
        info("Publishing to NPM..")
        exec("npm publish")
      }
      debugTimeEnd("Publish to NPM")

      // Publish to Visual Studio Code Marketplace
      debugTime("Publish to VSCE")
      if (publishToVSCE) {
        info("Publishing to the Visual Studio Code Marketplace..")
        exec("vsce publish")
      }
      debugTimeEnd("Publish to VSCE")

      // Publish to git repository (Last step!)
      debugTime("Publish to git repository")
      if (publishToGIT) {
        info("Pushing to git repository..")
        exec("git push --follow-tags")
      }
      debugTimeEnd("Publish to git repository")
    })
    .catch(err => {
      // Throw an error if something goes wrong
      if (err) throw err
    })
}
debugTimeEnd("Questions")

/**
 * Register a code provider where the code should be uploaded
 * @param provider Provider to upload the code to
 */
const registerProvider = (provider: string) => {
  providers.push({ name: provider })
}
