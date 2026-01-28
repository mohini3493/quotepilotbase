import "dotenv/config";
import cloudinary from "../src/utils/cloudinary";

async function testUpload() {
  console.log("Testing Cloudinary upload...");
  console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("API Key:", process.env.CLOUDINARY_API_KEY);
  console.log(
    "API Secret:",
    process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET",
  );

  try {
    // Upload a simple test image (1x1 red pixel)
    const testBase64 =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

    const result = await cloudinary.uploader.upload(testBase64, {
      folder: "quotepilot/test",
    });

    console.log("✅ Upload successful!");
    console.log("URL:", result.secure_url);
  } catch (error: any) {
    console.error("❌ Upload failed!");
    console.error("Error:", error.message);
    console.error("Full error:", JSON.stringify(error, null, 2));
  }
}

testUpload();
