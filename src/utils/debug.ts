import { debugInfo } from "../log/log"

let active = false

export const setDebuggerEnabled = (enabled: boolean) => {
  active = enabled
  if (enabled) debugInfo("Debug mode enabled!")
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
