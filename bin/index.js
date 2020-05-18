#! /usr/bin/env node
const program = require("commander");
const template = require("./template.json");
const fs = require("fs");
const execute = require("./execute");
const ora = require("ora");
let spinner = ora("serein downloading ...");
let projectName = "myapp";
// 尖括号（例如<required>）表示必填参数。方括号（例如[optional]）表示可选参数
program
  .version("1.0.0")
  .arguments("[name]")
  .action((name) => {
    projectName = name || "myapp";
  });
program.parse(process.argv);
if (projectName !== "myapp") {
  template.name = projectName;
}
execute(`mkdir ${projectName}`).then(async () => {
  spinner.start();
  fs.writeFile(
    `${getRePath(projectName, "package.json")}`,
    JSON.stringify(template, null, 2),
    "utf-8",
    async () => {
      try {
        await execute(`cd ${projectName} && yarn install`);
        await execute(`mkdir ${getRePath(projectName, "src")}`);
        await execute(
          `mkdir ${getRePath(projectName, "src/components")} ${getRePath(
            projectName,
            "src/utils"
          )}  ${getRePath(projectName, "src/static")}`
        );

        await fs.writeFileSync(
          `${getRePath(projectName, "src/index.js")}`,
          "ReactDOM.render(<h1>Hello Serein</h1>, document.getElementById('root'))",
          "utf-8"
        );
        spinner.succeed("加载完成");
        console.log(`cd ${projectName}`);
        console.log(`yarn start`);
      } catch (err) {
        spinner.fail(err);
      }
    }
  );
});

function getRePath(rootPath, path) {
  return `./${rootPath}/${path}`;
}

// const inquirer = require('inquirer');
// inquirer
//   .prompt([
//     // 交互式的问题，例如名字，是否使用ts
//   ])
//   .then(answers => {
//     // 回调函数，answers 就是用户输入的内容，是个对象
//   });
