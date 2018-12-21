import * as fs from "fs"

export const isGit = (): boolean => {
  return fs.existsSync(".git")
}

export const isNPM = (): boolean => {
  return fs.existsSync("package.json")
}

export const isVSCE = (): boolean => {
  if (fs.existsSync("package.json") && fs.existsSync("node_modules/vscode")) return true
  else return false
}
