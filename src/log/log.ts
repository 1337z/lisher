import chalk from "chalk"

const infoColor = chalk.magentaBright
const debugInfoColor = chalk.whiteBright

// Setup console output
export const log = console.log

export const info = (message: string) => {
  log(infoColor(message))
}

export const debugInfo = (message: any) => {
  log(debugInfoColor(message))
}
