#!/usr/bin/env node

var fs = require('fs-extra')
var git = require('nodegit')
var path = require('path')

var cloneOpts = {
  fetchOpts: {
    callbacks: {
      certificateCheck: function() { return 1 },
    }
  }
};

var repository_url = "https://github.com/tkanto/nodegit-filehandles-windows.git"
var repo = null
var headCommit = null

//Cleanup any leftovers in the test directory
fs.remove("./test_repository", function(err) {
  git.Clone(repository_url, "./test_repository", cloneOpts)
  .then(function() {
      return git.Repository.open("./test_repository")
  })
  .then(function(repository) {
    console.log("Repository cloned. If we tried to remove the directory here, it would succesfully remove the directory.");
    repo = repository
    return repo.getBranchCommit("master")
  })

  .then(function(head) {
    headCommit = head
    return repo.getBranchCommit("origin/master")
  })
  .then(function(upstreamCommit) {
    var walker = repo.createRevWalk()
    walker.sorting(git.Revwalk.SORT.Time)
    walker.push(headCommit.sha())
    return walker.getCommitsUntil(function (commit) {
      return commit === upstreamCommit.sha()
    })
  })
  .then(function (array) {
    console.log("Revwalk produced: " + array)
    return repo.getHeadCommit() //just so we return a promise
  })

  .then(function () {
    console.log("But now that we've accessed data from the repository, the .git/objects/pack/* files are opened but not closed, and the program will hang when trying to remove the directory.")
    repo.cleanup()
    fs.remove("./test_repository", function (err) {
      if (err) { console.error(err); process.exit(1) }
      console.log("./test_repository succesfully removed. This will not occur on a windows machine.")
    });
  })
  .catch(function (err) {
    console.error(err)
  })
});
