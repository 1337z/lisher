"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require("semver");
exports.patch = (oldTargetModuleVersion) => {
    return `PATCH => ${semver.inc(oldTargetModuleVersion, "patch")}`;
};
exports.minor = (oldTargetModuleVersion) => {
    return `MINOR => ${semver.inc(oldTargetModuleVersion, "minor")}`;
};
exports.major = (oldTargetModuleVersion) => {
    return `MAJOR => ${semver.inc(oldTargetModuleVersion, "major")}`;
};
exports.prePatch = (oldTargetModuleVersion) => {
    return `pre-patch => ${semver.inc(oldTargetModuleVersion, "prepatch")}`;
};
exports.preMinor = (oldTargetModuleVersion) => {
    return `pre-minor => ${semver.inc(oldTargetModuleVersion, "preminor")}`;
};
exports.preMajor = (oldTargetModuleVersion) => {
    return `pre-major => ${semver.inc(oldTargetModuleVersion, "premajor")}`;
};
exports.preRelease = (oldTargetModuleVersion) => {
    return `pre-release => ${semver.inc(oldTargetModuleVersion, "prerelease")}`;
};
