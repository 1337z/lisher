"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = __importStar(require("inquirer"));
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
const isGit = () => {
    return require("is-git-repository")();
};
const isNPM = () => {
    return fs.existsSync("package.json");
};
const log = console.log;
const info = chalk_1.default.magenta;
let args;
let providers = [];
exports.run = (_args) => {
    args = _args;
    flow();
};
const flow = () => {
    // Detect and register providers
    if (isGit())
        registerProvider("GIT");
    if (isNPM())
        registerProvider("NPM");
    let questions = [
        // Only ask this question when a git repository is detected
        {
            type: "checkbox",
            name: "provider",
            message: "Please select where we should publish your module.\n",
            choices: providers,
            when: () => {
                return isGit;
            }
        },
        // Ask for the version increase if a package.json is detected
        {
            type: "list",
            name: "version",
            message: "Is your publication a patch, a minor or a major change?",
            choices: ["PATCH", "MINOR", "MAJOR", "Don't change the version"],
            when: () => {
                return isNPM;
            }
        }
    ];
    inquirer
        .prompt(questions)
        .then((answers) => {
        const publishToGIT = answers.provider.indexOf("GIT") > -1;
        const publishToNPM = answers.provider.indexOf("NPM") > -1;
        if (isGit()) {
            const unstagedFiles = child_process_1.execSync("git diff --name-only").toString();
            if (unstagedFiles) {
                log(info("Git working directory not clean!\nPlease commit your changes before publishing."));
                log(unstagedFiles);
                log(info("Aborting."));
                throw Error("Git working directory not clean.");
            }
        }
        if (answers.version != "Don't change the version")
            log(info(`Increasing the version (${answers.version})`));
        if (answers.version == "PATCH")
            exec("npm version patch");
        if (answers.version == "MINOR")
            exec("npm version minor");
        if (answers.version == "MAJOR")
            exec("npm version major");
        if (publishToNPM) {
            log(info("Publishing to NPM.."));
            exec("npm publish");
        }
        if (publishToGIT) {
            log(info("Pushing to git repository.."));
            exec("git push --follow-tags");
        }
    })
        .catch(err => { });
};
const exec = (command) => {
    child_process_1.execSync(command, { stdio: [process.stdin, process.stdout, process.stderr] });
};
const registerProvider = (provider) => {
    providers.push({ name: provider });
};
