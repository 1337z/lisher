"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require("semver");
let oldTargetModuleVersion;
exports.setOldTargetModuleVersion = (version) => {
    oldTargetModuleVersion = version || "";
};
exports.patch = () => {
    return `PATCH => ${semver.inc(oldTargetModuleVersion, "patch")}`;
};
exports.minor = () => {
    return `MINOR => ${semver.inc(oldTargetModuleVersion, "minor")}`;
};
exports.major = () => {
    return `MAJOR => ${semver.inc(oldTargetModuleVersion, "major")}`;
};
exports.prePatch = () => {
    return `pre-patch => ${semver.inc(oldTargetModuleVersion, "prepatch")}`;
};
exports.preMinor = () => {
    return `pre-minor => ${semver.inc(oldTargetModuleVersion, "preminor")}`;
};
exports.preMajor = () => {
    return `pre-major => ${semver.inc(oldTargetModuleVersion, "premajor")}`;
};
exports.preRelease = () => {
    return `pre-release => ${semver.inc(oldTargetModuleVersion, "prerelease")}`;
};
