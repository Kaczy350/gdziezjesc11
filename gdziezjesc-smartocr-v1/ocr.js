
import Tesseract from 'tesseract.js';

export async function runOCR(imageUrl) {
  try {
    const result = await Tesseract.recognize(imageUrl, 'pol+eng', {
      logger: (m) => console.log("OCR progress:", m),
    });
    return result.data.text;
  } catch (error) {
    console.error("OCR error:", error);
    return null;
  }
}
