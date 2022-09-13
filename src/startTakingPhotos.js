const { exec } = require("child_process");
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');

const getImagePathsNewestToOldest = require('./getImagePathsNewestToOldest');

const defaultRemoveFile = promisify(fs.unlink);

const executeCommand = (command) => new Promise((res, rej) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      rej({ error });
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      rej({ stderr });
    }
    res(stdout);
  });
});

const takeAPhoto = async ({ photoCommand, photosDirPath }) => {
  const dateString = new Date().toISOString()
    .replace('T', '_')
    .replace(/\:/g, '-')
    .replace('.', '_')
    .replace('Z', '');
  const photoFileName = `${dateString}.jpg`;
  const photoFilePath = path.join(photosDirPath, photoFileName);
  const photoCommandWithReplacedName = photoCommand.replace('FILEPATH', photoFilePath);

  try {
    await executeCommand(photoCommandWithReplacedName);
  } catch (error) {
    console.error('Could not take a photo');
  }
};
const cleanUpOldPhotos = async ({ maxPhotosToKeep, photosDirPath, removeFileCommand }) => {
  const imageNames = await getImagePathsNewestToOldest({ imagesDirName: photosDirPath });
  const oldImagePaths = imageNames
    .slice(maxPhotosToKeep)
    .map(fileName => path.join(photosDirPath, fileName));

  const removeFile = removeFileCommand
    ? (filepath) => executeCommand(removeFileCommand.replace('FILEPATH', filepath))
    : defaultRemoveFile;

    try {
      await Promise.all(
        oldImagePaths.map(imagePath => removeFile(imagePath))
      );
    } catch (error) {
      console.error('Could not remove old photos');
    }

}

const startTakingPhotos = ({ interval, maxPhotosToKeep, photoCommand, photosDirPath, removeFileCommand }) => {
  const loop = async () => {
    await takeAPhoto({ photoCommand, photosDirPath });
    await cleanUpOldPhotos({ maxPhotosToKeep, photosDirPath, removeFileCommand });
  };

  setInterval(loop, interval);
}

module.exports = startTakingPhotos;
