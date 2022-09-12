const config = {
  USERNAME: process.env.USERNAME || 'test',
  PASSWORD: process.env.PASSWORD || 'test',
  PORT: Number(process.env.PORT) || 4000,
  PHOTO_INTERVAL_MS: Number(process.env.PHOTO_INTERVAL_MS) || 10000,
  MAX_PHOTOS_TO_KEEP: Number(process.env.MAX_PHOTOS_TO_KEEP) || 360,
  PHOTO_COMMAND: process.env.PHOTO_COMMAND || null,
  PHOTOS_DIR_PATH: process.env.PHOTOS_DIR_PATH,
}

module.exports = config;
