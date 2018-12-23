import { debugInfo, boxMessage } from "../log/log"
import chalk from "chalk"

let active = false

export const setDebuggerEnabled = (enabled: boolean) => {
  active = enabled
  if (enabled) boxMessage("DEBUG MODE", chalk.yellow)
}

export const debugTime = (...args: any) => {
  if (active) return console.time(args)
}

export const debugTimeEnd = (...args: any) => {
  if (active) return console.timeEnd(...args)
}

export const debugLogTime = () => {
  if (active) return console.timeLog
}

export const debugMessage = (message: any) => {
  if (active) debugInfo(message)
}
