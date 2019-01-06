const semver = require("semver")

let oldTargetModuleVersion: string

export const setOldTargetModuleVersion = (version: string) => {
  oldTargetModuleVersion = version || "could not get version"
}

export const patch = (): string => {
  return `PATCH => ${semver.inc(oldTargetModuleVersion, "patch")}`
}

export const minor = (): string => {
  return `MINOR => ${semver.inc(oldTargetModuleVersion, "minor")}`
}

export const major = (): string => {
  return `MAJOR => ${semver.inc(oldTargetModuleVersion, "major")}`
}

export const prePatch = (): string => {
  return `pre-patch => ${semver.inc(oldTargetModuleVersion, "prepatch")}`
}

export const preMinor = (): string => {
  return `pre-minor => ${semver.inc(oldTargetModuleVersion, "preminor")}`
}

export const preMajor = (): string => {
  return `pre-major => ${semver.inc(oldTargetModuleVersion, "premajor")}`
}

export const preRelease = (): string => {
  return `pre-release => ${semver.inc(oldTargetModuleVersion, "prerelease")}`
}
