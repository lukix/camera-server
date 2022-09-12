const { exec } = require("child_process");
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');

const getImagePathsNewestToOldest = require('./getImagePathsNewestToOldest');

const removeFile = promisify(fs.unlink);

const takeAPhoto = async ({ photoCommand, photosDirPath }) => {
  const [dateString] = new Date().toISOString()
    .replace('T', '_')
    .replace(/\:/g, '-')
    .split('.');
  const photoFileName = `${dateString}.jpg`;
  const photoFilePath = path.join(photosDirPath, photoFileName);
  const photoCommandWithReplacedName = photoCommand.replace('FILEPATH', photoFilePath);

  return await new Promise((res) => {
    exec(photoCommandWithReplacedName, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
      }
      res();
    });
  });
};
const cleanUpOldPhotos = async ({ maxPhotosToKeep, photosDirPath }) => {
  const imageNames = await getImagePathsNewestToOldest({ imagesDirName: photosDirPath });
  const oldImagePaths = imageNames
    .slice(maxPhotosToKeep)
    .map(fileName => path.join(photosDirPath, fileName));

  await Promise.all(
    oldImagePaths.map(imagePath => removeFile(imagePath))
  );
}

const startTakingPhotos = ({ interval, maxPhotosToKeep, photoCommand, photosDirPath }) => {
  const loop = async () => {
    await takeAPhoto({ photoCommand, photosDirPath });
    await cleanUpOldPhotos({ maxPhotosToKeep, photosDirPath });
  };

  setInterval(loop, interval);
}

module.exports = startTakingPhotos;
