const MultipartParser = require("lambda-multipart-parser");
const sharp = require("sharp");
const moment = require("moment");

exports.handler = async (event, context) => {
const formdata = await MultipartParser.parse(event);

  try {
    // setup date for text overlay
    const width = "400";
    const height = "400";
    const date = `Date cached: ${moment().format("MMM Do YYYY, h:mm a")}`;
    const svgImage = `
    <svg width="${width}" height="${height}">
    <style>
      .title { fill: blue; font-family: helvetica; font-size: 15px; font-weight: bold;}
    </style>
    <text x="10%" y="10%"  class="title">${date}</text>
    </svg>`;
    const svgBuffer = Buffer.from(svgImage);

  // instantiate sharp with array buffer from posted image
   const { data, info } = await sharp(formdata.files[0].content)
      .ensureAlpha()
      .resize({ width: 800 })
      .composite([
          {
            input: svgBuffer,
            gravity: 'northeast'
          },
        ])
      .toBuffer({
        resolveWithObject: true,
      });
    const result =data

    // Return a 200 response with the content headers and Base64 body
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": result.length,
      },
      isBase64Encoded: true,
      body: result.toString("base64"),
    };
  } catch (e) {
    console.log(`Failed to manipulate image: ${e}`);
    return {
      statusCode: 502,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: `Error manipulating image: ${e}`,
      }),
    };
  }
};
