import * as inquirer from "inquirer"
import chalk from "chalk"
import { execSync } from "child_process"
import { isGit, isNPM, isVSCE } from "./detector/detector"

// Setup console output
const log = console.log
const info = chalk.magentaBright

// Global variables
let args: string[]
let providers: Array<object> = []

// Inital function
export const run = (_args: string[]) => {
  args = _args

  // Detect and register providers
  if (isGit()) registerProvider("GIT")
  if (isNPM()) registerProvider("NPM")
  if (isVSCE()) registerProvider("VSCE")

  let questions: any = [
    // Only ask this question when a git repository is detected
    {
      type: "checkbox",
      name: "provider",
      message: "Please select where we should publish your module.\n",
      choices: providers,
      when: () => {
        return isGit
      }
    },
    // Ask for the version increase if a package.json is detected
    {
      type: "list",
      name: "version",
      message: "Is your publication a patch, a minor or a major change?",
      choices: ["PATCH", "MINOR", "MAJOR", "Don't change the version"],
      when: () => {
        return isNPM
      }
    }
  ]

  inquirer
    .prompt(questions) // Prompt the questions
    .then((answers: any) => {
      // Result -> Function

      // Set publish providers
      const publishToGIT: boolean = answers.provider.indexOf("GIT") > -1
      const publishToNPM: boolean = answers.provider.indexOf("NPM") > -1
      const publishToVSCE: boolean = answers.provider.indexOf("VSCE") > -1

      // Check for unstaged changes
      if (isGit()) {
        const unstagedFiles = execSync("git diff --name-only").toString()
        if (unstagedFiles) {
          log(info("Git working directory not clean!\nPlease commit your changes before publishing."))
          log(unstagedFiles)
          log(info("Aborting."))
          throw Error("Git working directory not clean.")
        }
      }

      if (answers.version != "Don't change the version") log(info(`Increasing the version (${answers.version})`))

      // Version the 'package.json'
      if (answers.version == "PATCH") exec("npm version patch")
      if (answers.version == "MINOR") exec("npm version minor")
      if (answers.version == "MAJOR") exec("npm version major")

      // Publish to NPM
      if (publishToNPM) {
        log(info("Publishing to NPM.."))
        exec("npm publish")
      }

      // Publish to Visual Studio Code Marketplace
      if (publishToVSCE) {
        log(info("Publishing to the Visual Studio Code Marketplace.."))
        exec("vsce publish")
      }

      // Publish to git repository (Last step!)
      if (publishToGIT) {
        log(info("Pushing to git repository.."))
        exec("git push --follow-tags")
      }
    })
    .catch(err => {
      // Throw an error if something goes wrong
      if (err) throw err
    })
}

/**
 * Execute a command syncronously with feedback
 * @param command Command to execute
 */
const exec = (command: string) => {
  execSync(command, { stdio: [process.stdin, process.stdout, process.stderr] })
}

/**
 * Register a code provider where the code should be uploaded
 * @param provider Provider to upload the code to
 */
const registerProvider = (provider: string) => {
  providers.push({ name: provider })
}
