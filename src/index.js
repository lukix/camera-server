const express = require('express');

const getAuthMiddleware = require('./getAuthMiddleware');
const getNewestImageName = require('./getNewestImageName');
const getHTML = require('./getHTML');
const startTakingPhotos = require('./startTakingPhotos');
const config = require('./config');

const app = express();

app.disable('x-powered-by');

app.use(getAuthMiddleware({
  username: config.USERNAME,
  password: config.PASSWORD,
}));

app.use('/images', express.static(config.PHOTOS_DIR_PATH));

app.get('/', async (req, res) => {
  const newestImageName = await getNewestImageName({ imagesDirName: config.PHOTOS_DIR_PATH });
  const html = await getHTML({ imgPath: `/images/${newestImageName}` });
  res.send(html);
});

app.listen(config.PORT, () => {
  console.log(`Camera server listening on port ${config.PORT}`);
  console.log(config);
});

if (config.PHOTO_COMMAND) {
  startTakingPhotos({
    interval: config.PHOTO_INTERVAL_MS,
    maxPhotosToKeep: config.MAX_PHOTOS_TO_KEEP,
    photoCommand: config.PHOTO_COMMAND,
    removeFileCommand: config.REMOVE_FILE_COMMAND,
    photosDirPath: config.PHOTOS_DIR_PATH,
  });
} else {
  console.log('"PHOTO_COMMAND" environment variable is not specified.');
}
