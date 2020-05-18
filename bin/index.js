#! /usr/bin/env node
const program = require("commander");
const template = require("./template.json");
const fs = require("fs");
const execute = require("./execute");
const ora = require("ora");
let spinner = ora("serein downloading ...");

let projectName = "";
// 尖括号（例如<required>）表示必填参数。方括号（例如[optional]）表示可选参数
program
  .version("1.0.0")
  .arguments("[name]")
  .action((name) => {
    projectName = name;
  })
  .parse(process.argv);
if (!projectName) {
  console.warn("请按以下示例方式安装：\nresein-cli myapp");
  return false;
}

template.name = projectName;

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
        console.log(`cd ${projectName}\nyarn start`);
      } catch (err) {
        spinner.fail(err);
      }
    }
  );
});

function getRePath(rootPath, path) {
  return `./${rootPath}/${path}`;
}
