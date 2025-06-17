
import Tesseract from 'tesseract.js';

export async function runOCR(imageUrl) {
  console.log("🧠 Start OCR for:", imageUrl);
  try {
    const result = await Tesseract.recognize(imageUrl, 'pol+eng', {
      logger: (m) => console.log("OCR progress:", m),
    });
    console.log("✅ OCR result:", result.data.text);
    return result.data.text;
  } catch (error) {
    console.error("❌ OCR error:", error);
    return null;
  }
}
