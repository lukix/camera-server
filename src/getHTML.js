const getHTML = async ({ imgPath = null }) => {
  const bodyContent = imgPath
    ? `<img id="mainImage" src="${imgPath}" />`
    : 'No photos are available.'
  return `
    <html>
      <head>
        <title>Camera Server</title>
        <style>
          body {
            background: black;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
          }
          #mainImage {
            max-width: 100%;
            max-height: 100%;
          }
        </style>
      </head>
      <body>
        ${bodyContent}
      </body>
    </html>
  `
};

module.exports = getHTML;
