import chalk, { Chalk } from "chalk"

const boxen = require("boxen")

const infoColor = chalk.yellowBright
const successColor = chalk.yellow
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

export const boxMessageSuccess = (message: string, center: boolean = false) => {
  if (!center) success(boxen(message, { float: "left", borderStyle: "round" }))
  else success(boxen(message, { float: "center", borderStyle: "round" }))
}

export const boxMessage = (message: string, color: Chalk, center: boolean = false) => {
  if (!center) console.log(color(boxen(message, { float: "left", borderStyle: "round" })))
  else console.log(color(boxen(message, { float: "center", borderStyle: "round" })))
}
