var exec = require("child_process").exec;
function execute(cmd) {
  return new Promise((resolve, reject) =>
    exec(cmd, function(err, stdout, stderr) {
      if (err) {
        console.error(err);
        reject(err);
      }
      console.log(stdout)
      console.log(stderr)
      resolve();
    })
  );
}
module.exports = execute;
