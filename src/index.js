const express = require('express');

const getAuthMiddleware = require('./getAuthMiddleware');
const getNewestImageName = require('./getNewestImageName');
const startTakingPhotos = require('./startTakingPhotos');
const photoEventsManager = require('./photoEventsManager');
const config = require('./config');

const { triggerNewPhotoEvent, waitForNewPhoto } = photoEventsManager();
const app = express();

app.disable('x-powered-by');

app.use(getAuthMiddleware({
  username: config.USERNAME,
  password: config.PASSWORD,
}));

app.use('/images', express.static(config.PHOTOS_DIR_PATH));
app.use('/', express.static('public'));

app.get('/latest-image', async (req, res) => {
  const latestImageName = await getNewestImageName({ imagesDirName: config.PHOTOS_DIR_PATH });
  res.redirect(`images/${latestImageName}`);
});

app.get('/pool-next-image-availability', async (req, res) => {
  await waitForNewPhoto();
  res.send(200);
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
    triggerNewPhotoEvent,
  });
} else {
  console.log('"PHOTO_COMMAND" environment variable is not specified.');
}
