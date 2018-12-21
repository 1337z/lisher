import chalk from "chalk"

const infoColor = chalk.magentaBright

// Setup console output
export const log = console.log

export const info = (message: string) => {
  log(infoColor(message))
}
