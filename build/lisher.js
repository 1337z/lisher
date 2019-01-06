"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const choiceNames = __importStar(require("./choiceNames"));
const inquirer = __importStar(require("inquirer"));
const jsonHelper = __importStar(require("./utils/jsonHelper"));
const targetModule = __importStar(require("./targetModule"));
const terminal = __importStar(require("./utils/terminal"));
const log_1 = require("./log");
const debug_1 = require("./utils/debug");
const chalk_1 = __importDefault(require("chalk"));
exports.avaiblePublishProviders = [];
exports.debugStatus = false;
if (targetModule.isNPM()) {
    exports.targetModuleInfo = jsonHelper.fromFile("package.json");
    exports.oldTargetModuleVersion = exports.targetModuleInfo.version;
    choiceNames.setOldTargetModuleVersion(exports.oldTargetModuleVersion);
}
exports.run = (_argv) => __awaiter(this, void 0, void 0, function* () {
    exports.argv = _argv;
    exports.debugStatus = exports.argv.debug;
    debug_1.setDebuggerEnabled(exports.debugStatus);
    if (targetModule.isGIT()) {
        let unstagedFiles = terminal.execRaw("git diff --name-only").toString();
        unstagedFiles += terminal.execRaw("git ls-files --others --exclude-standard").toString();
        if (unstagedFiles) {
            log_1.info("Git working directory not clean!\nPlease commit your changes before publishing.");
            log_1.log(unstagedFiles);
            yield inquirer
                .prompt([
                {
                    type: "confirm",
                    name: "commit_changes",
                    message: "Do you want to write a quick commit message and continue?"
                }
            ])
                .then((answers) => __awaiter(this, void 0, void 0, function* () {
                if (answers.commit_changes) {
                    yield inquirer
                        .prompt([
                        {
                            type: "input",
                            name: "commit_message",
                            message: "Please enter the commit message"
                        }
                    ])
                        .then((answers) => {
                        log_1.info("Committing changes..");
                        terminal.exec("git add *");
                        terminal.exec(`git commit -m "${answers.commit_message}"`);
                        log_1.boxMessageSuccess("Commited changes!");
                    })
                        .catch(err => {
                        if (err)
                            throw err;
                    });
                }
                else {
                    log_1.info("Please commit your changes manually and run lisher again.");
                    throw Error("Git working directory not clean!");
                }
            }))
                .catch(err => {
                if (err)
                    throw err;
            });
        }
    }
    if (targetModule.isGIT())
        registerProvider("GIT");
    if (targetModule.isNPM())
        registerProvider("NPM");
    if (targetModule.isVSCE())
        registerProvider("VSCE");
    if (exports.debugStatus)
        registerProvider("Debug");
    let questions = [
        {
            type: "confirm",
            name: "grunt",
            message: "We found a Gruntfile. Should we run Grunt?",
            when: () => {
                return targetModule.isGRUNT();
            }
        },
        {
            type: "checkbox",
            name: "provider",
            message: `Please select where we should publish your module (${exports.targetModuleInfo.name || "could not get name"}).\n`,
            choices: exports.avaiblePublishProviders
        },
        {
            type: "list",
            name: "version",
            message: "Is your publication a patch, a minor or a major change?\n",
            choices: [
                choiceNames.patch(),
                choiceNames.minor(),
                choiceNames.major(),
                new inquirer.Separator(),
                choiceNames.prePatch(),
                choiceNames.preMinor(),
                choiceNames.preMajor(),
                choiceNames.preRelease(),
                "Don't change the version"
            ],
            when: () => {
                return targetModule.isNPM();
            }
        }
    ];
    yield inquirer
        .prompt(questions)
        .then((answers) => __awaiter(this, void 0, void 0, function* () {
        const publishToGIT = answers.provider.indexOf("GIT") > -1;
        const publishToNPM = answers.provider.indexOf("NPM") > -1;
        const publishToVSCE = answers.provider.indexOf("VSCE") > -1;
        const publishToDEBUG = exports.debugStatus;
        const runGrunt = answers.grunt;
        if (runGrunt) {
            log_1.info("Running Grunt..");
            terminal.exec("grunt");
            if (targetModule.isGIT()) {
                log_1.info("The changes made by Grunt need to be commited before publishing!");
                yield inquirer
                    .prompt([
                    {
                        type: "input",
                        name: "commit_message",
                        message: "Please enter the commit message"
                    }
                ])
                    .then((answers) => {
                    terminal.exec("git add *");
                    terminal.exec(`git commit -m "${answers.commit_message}"`);
                })
                    .catch(err => {
                    if (err)
                        throw err;
                });
            }
        }
        if (answers.version != "Don't change the version")
            log_1.info(`Increasing the version (${answers.version})`);
        if (answers.version == choiceNames.patch())
            terminal.exec("npm version patch");
        if (answers.version == choiceNames.minor())
            terminal.exec("npm version minor");
        if (answers.version == choiceNames.major())
            terminal.exec("npm version major");
        if (answers.version == choiceNames.prePatch())
            terminal.exec("npm version prepatch");
        if (answers.version == choiceNames.preMinor())
            terminal.exec("npm version preminor");
        if (answers.version == choiceNames.preMajor())
            terminal.exec("npm version premajor");
        if (answers.version == choiceNames.preRelease())
            terminal.exec("npm version prerelease");
        let published = [];
        if (publishToNPM) {
            log_1.info("Publishing to NPM..");
            terminal.exec("npm publish");
            published.push("NPM");
            log_1.boxMessageSuccess("Published to NPM!");
        }
        if (publishToVSCE) {
            log_1.info("Publishing to the Visual Studio Code Marketplace..");
            terminal.exec("vsce publish");
            published.push("VSCE");
            log_1.boxMessageSuccess("Published to Visual Studio Code Marketplace!");
        }
        if (publishToDEBUG) {
            published.push("DEBUG");
            log_1.boxMessageSuccess("'Published' to debug!");
        }
        if (publishToGIT) {
            log_1.info("Pushing to git repository..");
            terminal.exec("git push --follow-tags");
            published.push("GIT");
            log_1.boxMessageSuccess("Pushed to git repository!");
        }
        let resultMessage = "";
        resultMessage += `Published module to: ${published.toString()}`;
        if (targetModule.isNPM())
            resultMessage += "\n" + `Version: ${exports.oldTargetModuleVersion} => ${jsonHelper.fromFile("package.json").version} | ${answers.version.split(" ")[0]}`;
        log_1.boxMessageResult(resultMessage, chalk_1.default.greenBright, true);
    }))
        .catch(err => {
        if (err)
            throw err;
    });
});
const registerProvider = (provider) => {
    exports.avaiblePublishProviders.push({ name: provider });
};
