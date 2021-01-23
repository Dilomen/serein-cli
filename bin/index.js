#! /usr/bin/env node
const program = require("commander");
const template = require("./template.json");
const fs = require("fs");
const templateCfg = require('./template')
const execute = require("./execute");
const ora = require("ora");
let spinner = ora("serein downloading ...");
const config = require("../package.json");
const validateProjectName = require('validate-npm-package-name')
let projectName = "";
// 尖括号（例如<required>）表示必填参数。方括号（例如[optional]）表示可选参数
program
  .version(config.version || "1.0.0")
  .arguments("[name]")
  .action((name) => {
    projectName = name;
  })
  .parse(process.argv);
const projectNameVaild = validateProjectName(projectName)
if (!projectNameVaild) {
  console.warn("无效的项目名\n请参照指令: resein-cli myapp ");
  process.exit(1);
}
spinner.start();
template.name = projectName;
fs.mkdirSync(projectName)
fs.writeFile(
  `${getRePath(projectName, "package.json")}`,
  JSON.stringify(template, null, 2),
  "utf-8",
  async () => {
    try {
      await execute(`cd ${projectName} && npm install`);
      mkdir(getRePath(projectName, "src"), () => {
        mkdir(getRePath(projectName, "src/components"))
        mkdir(getRePath(projectName, "src/utils"))
        mkdir(getRePath(projectName, "src/static"))
        fs.writeFileSync(
          `${getRePath(projectName, "src/index.js")}`,
          templateCfg.template,
          "utf-8"
        );
        fs.writeFileSync(
          `${getRePath(projectName, "serein.config.js")}`,
          templateCfg.config,
          "utf-8"
        );
        spinner.succeed("生成项目成功");
        console.log(`\ncd ${projectName}\nyarn start`);
      })
    } catch (err) {
      spinner.fail(err);
    }
  }
);

function getRePath (rootPath, path) {
  return `./${rootPath}/${path}`;
}

function mkdir (path, callback) {
  fs.mkdir(path, (err) => {
    if (err) throw err
    callback && callback()
  })
}
