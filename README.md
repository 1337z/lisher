# (Pub)lisher

[![Issues](https://img.shields.io/github/issues/1337z/lisher.svg)]() [![Forks](https://img.shields.io/github/forks/1337z/lisher.svg)](https://github.com/1337z/lisher/fork) [![Stars](https://img.shields.io/github/stars/1337z/lisher.svg)](https://github.com/1337z/lisher/stargazers) [![License](https://img.shields.io/github/license/1337z/lisher.svg)](LICENSE)

> Simply publish your modules to NPM and GIT at the same time!

## :star: Features

> Unchecked features are in development

Publish your module to the every provider you like!  
In seconds.

Lisher also detects task managers as grunt and will ask you to run it before publishing!

### Publish providers

- GIT
- NPM (Node Package Manager)
- VSCE (Visual Studio Code Extension [Marketplace])

### Detections

- Detect GIT repository
  - Detect unstaged changes
  - Commit unstaged changes (we will ask you first)
- Detect NPM module
- Detect VS Code extension
- Detect Gruntfile

## :package: Install

```command
> npm i -g lisher
```

## :clipboard: Usage

> Simply run this command in your project directory. It will start the publish wizard :sparkles:

```command
> lisher
```

## :clapper: Preview

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
