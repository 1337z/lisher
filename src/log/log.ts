import chalk, { Chalk } from "chalk"

const boxen = require("boxen")

const infoColor = chalk.magentaBright
const successColor = chalk.greenBright
const debugInfoColor = chalk.whiteBright

// Setup console output
export const log = console.log

export const info = (message: string) => {
  log(infoColor(message))
}

export const success = (message: string) => {
  log(successColor(message))
}

export const debugInfo = (message: any) => {
  log(debugInfoColor(message))
}

export const boxMessageSuccess = (message: string) => {
  success(boxen(message, { float: "left", borderStyle: "round" }))
}

export const boxMessage = (message: string, color: Chalk) => {
  console.log(color(boxen(message, { float: "left", borderStyle: "round" })))
}
