module.exports = function(url) {

  var parts = require("url")
    .parse(url)
    .path
    .replace(/\.git/, '')
    .replace(/^\//, '')
    .split('/')

  return {
    user: parts[0],
    repo: parts[1]
  };

};
