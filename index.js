"use strict"

var url = require("url")
var util = require("util")
var isUrl = require("is-url")

module.exports = function(repo_url) {
  var obj = {}

  if (!repo_url) return null

  var shorthand = repo_url.match(/^([\w-_]+)\/([\w-_\.]+)#?([\w-_\.]+)?$/)
  var mediumhand = repo_url.match(/^bitbucket:([\w-_]+)\/([\w-_\.]+)#?([\w-_\.]+)?$/)
  var antiquated = repo_url.match(/^git@[\w-_\.]+:([\w-_]+)\/([\w-_\.]+)$/)

  if (shorthand) {
    obj.user = shorthand[1]
    obj.repo = shorthand[2]
    obj.branch = shorthand[3] || "master"
  } else if (mediumhand) {
    obj.user = mediumhand[1]
    obj.repo = mediumhand[2]
    obj.branch = mediumhand[3] || "master"
  } else if (antiquated) {
    obj.user = antiquated[1]
    obj.repo = antiquated[2].replace(/\.git$/i, "")
    obj.branch = "master"
  } else {
    if (!isUrl(repo_url)) return null
    var parsedURL = url.parse(repo_url)
    if (parsedURL.hostname != "bitbucket.org") return null
    var parts = parsedURL.pathname.match(/^\/([\w-_]+)\/([\w-_\.]+)/)
    if (!parts) return null
    obj.user = parts[1]
    obj.repo = parts[2].replace(/\.git$/i, "")
    obj.branch = "master"
  }

  obj.tarball_url = util.format("https://bitbucket.org/%s/%s/get/%s.tar.gz", obj.user, obj.repo, obj.branch)
  obj.api_url = util.format("https://api.bitbucket.org/2.0/repositories/%s/%s", obj.user, obj.repo)

  if (obj.branch === "master") {
    obj.https_url = util.format("https://bitbucket.org/%s/%s", obj.user, obj.repo)
    obj.travis_url = util.format("https://travis-ci.org/%s/%s", obj.user, obj.repo)
  } else {
    obj.https_url = util.format("https://bitbucket.org/%s/%s/branch/%s", obj.user, obj.repo, obj.branch)
    obj.travis_url = util.format("https://travis-ci.org/%s/%s?branch=%s", obj.user, obj.repo, obj.branch)
  }

  return obj
}
