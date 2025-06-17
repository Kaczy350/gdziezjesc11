
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


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { results, dish } = req.body;

  if (!Array.isArray(results) || !dish) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const withOCR = await Promise.all(results.map(async (resItem) => {
      const photoRef = resItem.photos?.[0]?.photo_reference;
      if (!photoRef) return resItem;

      const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
      console.log("🧠 OCR dla:", resItem.name);

      const text = await runOCR(imageUrl);
      if (!text) return resItem;

      const matched = text.toLowerCase().includes(dish.toLowerCase());
      return { ...resItem, ocrText: matched ? text : null };
    }));

    res.status(200).json(withOCR);
  } catch (error) {
    console.error("❌ Błąd OCR handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
