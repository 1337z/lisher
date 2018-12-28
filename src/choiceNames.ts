import { oldTargetModuleVersion } from "./lisher"

const semver = require("semver")

export const patch = (oldTargetModuleVersion: string) => {
  return `PATCH => ${semver.inc(oldTargetModuleVersion, "patch")}`
}

export const minor = (oldTargetModuleVersion: string) => {
  return `MINOR => ${semver.inc(oldTargetModuleVersion, "minor")}`
}

export const major = (oldTargetModuleVersion: string) => {
  return `MAJOR => ${semver.inc(oldTargetModuleVersion, "major")}`
}

export const prePatch = (oldTargetModuleVersion: string) => {
  return `pre-patch => ${semver.inc(oldTargetModuleVersion, "prepatch")}`
}

export const preMinor = (oldTargetModuleVersion: string) => {
  return `pre-minor => ${semver.inc(oldTargetModuleVersion, "preminor")}`
}

export const preMajor = (oldTargetModuleVersion: string) => {
  return `pre-major => ${semver.inc(oldTargetModuleVersion, "premajor")}`
}

export const preRelease = (oldTargetModuleVersion: string) => {
  return `pre-release => ${semver.inc(oldTargetModuleVersion, "prerelease")}`
}
