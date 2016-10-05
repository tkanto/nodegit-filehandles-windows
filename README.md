# nodegit-filehandles-windows
This is a test repository to demonstrate that nodegit keeps the filehandles to .git/objects/pack/\* open after RevWalking through commits, preventing removal of the repository directory while the program is still running.

# Testing
To test this, simply install nodegit and fs-extra (used to attempt to remove the directory) with `npm install .` and run `node index.js` in the repository directory in a Windows environment.
