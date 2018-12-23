import { debugInfo, boxMessage } from "../log"
import chalk from "chalk"

let active = false

export const setDebuggerEnabled = (enabled: boolean) => {
  active = enabled
  if (enabled) boxMessage("DEBUG MODE", chalk.yellow)
}

export const debugTime = (name: string) => {
  if (active) return console.time(name)
}

export const debugTimeEnd = (name: string) => {
  if (active) return console.timeEnd(name)
}

export const debugLogTime = () => {
  if (active) return console.timeLog
}

export const debugMessage = (message: any) => {
  if (active) debugInfo(message)
}
