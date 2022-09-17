const $image = document.querySelector('#mainImage');
const $imageTimestamp = document.querySelector('#imageTimestamp');

const changeImage = (url) => {
  $image.src = url;
  $imageTimestamp.innerHTML = url;
}

const wait = (timeMs) => new Promise(res => setTimeout(res, timeMs));

const fetchNextImage = async () => {
  try {
    const response = await fetch('pool-next-image-availability');
    if (!response.ok) {
      throw new Error(`Polling for the next image failed with status=${response.status}`);
    }
    const { imageUrl } = await response.json();
    changeImage(imageUrl);
  } catch(error) {
    console.error(error);
    await wait(2000);
  } finally {
    setTimeout(fetchNextImage, 1);
  }
}
fetchNextImage();
