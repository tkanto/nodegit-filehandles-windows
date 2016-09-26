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

//Cleanup any leftovers in the test directory
fs.remove("./test_repository", function(err) {
  git.Clone(repository_url, "./test_repository", cloneOpts)
  .then(function() {
      return git.Repository.open("./test_repository")
  })
  .then(function(repo) {
    console.log("Repository cloned. If we tried to remove the directory here, it would succesfully remove the directory.");
    return repo.getHeadCommit()
  })
  .then(function(head) {
    console.log("But now that we've accessed data from the repository, the .git/objects/pack/* files are opened but not closed, and the program will hang when trying to remove the directory.")
    fs.remove("./test_repository", function (err) {
      if (err) { console.error(err); process.exit(1) }
      console.log("./test_repository succesfully removed. This will not occur on a windows machine.")
    });
  })
});
