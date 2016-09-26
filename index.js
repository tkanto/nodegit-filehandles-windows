#!/usr/bin/env node

var prompt = require('prompt')
var fs = require('fs-extra')
var git = require('nodegit')
var path = require('path')

var sshPubKey = path.join(process.env.HOME, '.ssh', 'id_rsa.pub')
var sshPrivKey = path.join(process.env.HOME, '.ssh', 'id_rsa')

prompt.start()
prompt.get(['repository'], function(err, result) {
  if (err) { console.error(err); process.exit(1); }

  var cloneOpts = {
    fetchOpts: {
      callbacks: {
        certificateCheck: function() { return 1 },
        credentials: function(url, username) {
          return git.Cred.sshKeyNew(username, sshPubKey, sshPrivKey, "");
        }
      }
    }
  };

  //Cleanup any leftovers in the test directory
  fs.remove("./test_repository", function(err) {
    git.Clone(result.repository, "./test_repository", cloneOpts)
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
});
