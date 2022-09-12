const fs = require('fs');
const { promisify } = require('util');

const readDir = promisify(fs.readdir);

const getImagePathsNewestToOldest = async ({ imagesDirName }) => {
  const filesList = await readDir(imagesDirName);
  return filesList.sort((a, b) => b.localeCompare(a));
}

module.exports = getImagePathsNewestToOldest;
