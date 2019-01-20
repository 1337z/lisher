# (Pub)lisher :rocket:

[![Build Status](https://travis-ci.com/1337z/lisher.svg?branch=master)](https://travis-ci.com/1337z/lisher) [![Issues](https://img.shields.io/github/issues/1337z/lisher.svg)](https://github.com/1337z/lisher/issues) [![Forks](https://img.shields.io/github/forks/1337z/lisher.svg)](https://github.com/1337z/lisher/fork) [![Stars](https://img.shields.io/github/stars/1337z/lisher.svg)](https://github.com/1337z/lisher/stargazers) [![License](https://img.shields.io/github/license/1337z/lisher.svg)](LICENSE)

> Simple package publisher/releaser for your projects with live output!

---

<p align="center">
<strong><a href="#star-features">Features</a></strong>
|
<strong><a href="#package-install">Installation</a></strong>
|
<strong><a href="#clipboard-usage">Usage</a></strong>
|
<strong><a href="#clapper-preview">Preview (outdated)</a></strong>
|
<strong><a href="#license">License</a></strong>
</p>

---

## :star: Features

![Preview](https://i.imgur.com/wJnWbSW.gif)

Pub`lish` your module to NPM, GIT and VSCE with a single command.  
You can choose where you want your module to be published.  
Lisher will detect task managers as grunt and will ask you to run them before publishing!  
You forgot to commit your changes? Don't worry, lisher will notify you and if you want you can also set the commit message in lisher itself for an even faster publication.

### Publish providers

- GIT
- NPM (Node Package Manager)
- VSCE (Visual Studio Code Extension [Marketplace])
- Want more? Send an [issue](https://github.com/1337z/lisher/issues/new) or [pull request](https://github.com/1337z/lisher/pulls) :)

### Detections

- Detect GIT repository
  - Detect unstaged changes
  - Commit unstaged changes (we will ask you first)
- Detect NPM module
- Detect VS Code extension
- Detect Gruntfile
- Want more? Send an [issue](https://github.com/1337z/lisher/issues/new) or [pull request](https://github.com/1337z/lisher/pulls) :)

## :package: Install

```command
$ npm i -g lisher
```

## :clipboard: Usage

> Simply run this command in your project directory. It will start the publish wizard :sparkles:

```command
$ lisher
```

### Task managers

#### Grunt

If `lisher` detects a _Gruntfile_, it will ask you to run Grunt for you before publishing the module. If you select **Yes** (standard selection) `lisher` will run Grunt for you.

### Publish to a git repository

> If you have uncommited files, it's good to commit them before publishing the project. Lisher will ask you to do so if you haven't already.  
> **Notice:** When you commit your changes via the `lisher` interface you won't be able to set a commit **message body** for the sake of fast publishing.

1. First of all start Lisher

```command
$ lisher
```

2. Select `GIT`
3. Follow the instructions given by the terminal

### Publish to NPM

> If you have uncommited files, it's good to commit them before publishing the project. Lisher will ask you to do so if you haven't already.  
> **Notice:** When you commit your changes via the `lisher` interface you won't be able to set a commit **message body** for the sake of fast publishing.

1. First of all start Lisher

```command
$ lisher
```

2. Select `NPM`
3. Follow the instructions given by the terminal

### Publish to the Visual Studio Code Marketplace

> If you have uncommited files, it's good to commit them before publishing the project. Lisher will ask you to do so if you haven't already.  
> **Notice:** When you commit your changes via the `lisher` interface you won't be able to set a commit **message body** for the sake of fast publishing.

1. First of all start Lisher

```command
$ lisher
```

2. Select `VSCE`
3. Follow the instructions given by the terminal

## :clapper: Preview

### _Outdated!_

<details>
<summary>GIT</summary>

### GIT

![Preview GIT](https://i.imgur.com/CLg5uFW.gif)

#### GIT with dirty working directory

![Preview GIT dirty workdir](https://i.imgur.com/MXi6KJE.gif)

</details>

<details>
<summary>Grunt</summary>

### Grunt task manager

![Preview Grunt](https://i.imgur.com/8SASVLE.gif)

</details>

<details>
<summary>NPM</summary>

### NPM & GIT

![Preview NPM](https://i.imgur.com/fKOa0mv.gif)

</details>

<details>
<summary>VSCE</summary>

### VSCE & GIT

![Preview VSCE](https://i.imgur.com/ljn4bti.gif)

</details>

## License

```
MIT License

Copyright (c) 2018-2019 MarvinJWendt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```
