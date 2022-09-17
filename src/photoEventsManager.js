const { EventEmitter } = require('events');

const PHOTO_EVENT_NAME = 'new-photo';

const photoEventsManager = () => {
  const photoEventEmmitter = new EventEmitter();
  const triggerNewPhotoEvent = () => photoEventEmmitter.emit(PHOTO_EVENT_NAME);
  const waitForNewPhoto = () => new Promise(res => photoEventEmmitter.once(PHOTO_EVENT_NAME, res));

  return { triggerNewPhotoEvent, waitForNewPhoto };
};

module.exports = photoEventsManager;
