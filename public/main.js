const $image = document.querySelector('#mainImage');

const wait = (timeMs) => new Promise(res => setTimeout(res, timeMs));

const fetchNextImage = async () => {
  try {
    console.log(`Refresh timestamp: ${Date.now()}`);
    const response = await fetch('pool-next-image-availability');
    if (!response.ok) {
      throw new Error(`Polling for the next image failed with status=${response.status}`);
    }
    $image.src = `latest-image?cacheBreaker=${Date.now()}`;
  } catch(error) {
    console.error(error);
    await wait(2000);
  } finally {
    setTimeout(fetchNextImage, 1);
  }
}
fetchNextImage();
