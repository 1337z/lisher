import * as inquirer from "inquirer"
import * as fs from "fs"
import { execSync } from "child_process"
import chalk from "chalk"
const isGit = require("is-git-repository")

const log = console.log
const info = chalk.magenta

let args: string[]

export const run = (_args: string[]) => {
  args = _args
  flow()
}

function flow() {
  let questions: any = [
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

  inquirer.prompt(questions).then((answers: any) => {
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

const exec = (command: string) => {
  execSync(command, { stdio: [process.stdin, process.stdout, process.stderr] })
}
