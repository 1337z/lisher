import * as inquirer from "inquirer"
import * as fs from "fs"
import { execSync } from "child_process"
import chalk from "chalk"

const isGit = (): boolean => {
  return require("is-git-repository")()
}

const isNPM = (): boolean => {
  return fs.existsSync("package.json")
}

const log = console.log
const info = chalk.magenta

let args: string[]
let providers: Array<object> = []

export const run = (_args: string[]) => {
  args = _args
  flow()
}

const flow = () => {
  // Detect and register providers
  if (isGit()) registerProvider("GIT")
  if (isNPM()) registerProvider("NPM")

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
    .prompt(questions)
    .then((answers: any) => {
      const publishToGIT = answers.provider.indexOf("GIT") > -1
      const publishToNPM = answers.provider.indexOf("NPM") > -1

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

      if (answers.version == "PATCH") exec("npm version patch")
      if (answers.version == "MINOR") exec("npm version minor")
      if (answers.version == "MAJOR") exec("npm version major")

      if (publishToNPM) {
        log(info("Publishing to NPM.."))
        exec("npm publish")
      }

      if (publishToGIT) {
        log(info("Pushing to git repository.."))
        exec("git push --follow-tags")
      }
    })
    .catch(err => {})
}

const exec = (command: string) => {
  execSync(command, { stdio: [process.stdin, process.stdout, process.stderr] })
}

const registerProvider = (provider: string) => {
  providers.push({ name: provider })
}
