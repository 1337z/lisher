import * as inquirer from "inquirer"
import { info, log } from "./log/log"
import { isGIT, isNPM, isVSCE, isGRUNT } from "./detector/detector"
import { exec, execRaw } from "./utils/exec"

// Global variables
let argv: any
let debug = false
let providers: Array<object> = []

// Inital function
export const run = (_argv: string[]) => {
  argv = _argv
  debug = argv.debug

  // Detect and register providers
  if (isGIT()) registerProvider("GIT")
  if (isNPM()) registerProvider("NPM")
  if (isVSCE()) registerProvider("VSCE")

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

  inquirer
    .prompt(questions) // Prompt the questions
    .then(async (answers: any) => {
      // Result -> Function

      // Set publish providers
      const publishToGIT: boolean = answers.provider.indexOf("GIT") > -1
      const publishToNPM: boolean = answers.provider.indexOf("NPM") > -1
      const publishToVSCE: boolean = answers.provider.indexOf("VSCE") > -1

      const runGrunt: boolean = answers.grunt

      // Check for unstaged changes
      if (isGIT()) {
        const unstagedFiles = execRaw("git diff --name-only").toString()
        if (unstagedFiles) {
          info("Git working directory not clean!\nPlease commit your changes before publishing.")
          log(unstagedFiles)
          info("Aborting.")
          throw Error("Git working directory not clean.")
        }
      }

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

      if (answers.version != "Don't change the version") info(`Increasing the version (${answers.version})`)

      // Version the 'package.json'
      if (answers.version == "PATCH") exec("npm version patch")
      if (answers.version == "MINOR") exec("npm version minor")
      if (answers.version == "MAJOR") exec("npm version major")

      // Publish to NPM
      if (publishToNPM) {
        info("Publishing to NPM..")
        exec("npm publish")
      }

      // Publish to Visual Studio Code Marketplace
      if (publishToVSCE) {
        info("Publishing to the Visual Studio Code Marketplace..")
        exec("vsce publish")
      }

      // Publish to git repository (Last step!)
      if (publishToGIT) {
        info("Pushing to git repository..")
        exec("git push --follow-tags")
      }
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
  providers.push({ name: provider })
}
