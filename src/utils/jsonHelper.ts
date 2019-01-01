import * as fs from "fs"

export const fromFile = (path: string) => {
  return JSON.parse(fs.readFileSync(path).toString())
}
