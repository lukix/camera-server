const path = require('path');

const getImagePathsNewestToOldest = require('./getImagePathsNewestToOldest');

const getNewestImageName = async ({ imagesDirName }) => {
  const files = await getImagePathsNewestToOldest({ imagesDirName });
  const fileName = files[0];

  if (!fileName) {
    return null;
  }

  return fileName;
};

module.exports = getNewestImageName;
