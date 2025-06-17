
import { useState } from "react";
import SearchBar from "../SearchBar";
import RestaurantList from "../RestaurantList";
import { fetchResults } from "../search";
import { runOCR } from "../ocr";

export default function HomePage() {
  const [results, setResults] = useState([]);

  const handleSearch = async (dish, city) => {
    console.log("🔍 Szukam:", dish, city);
    try {
      const data = await fetchResults(dish, city);
      console.log("📥 Wyniki z Google:", data);

      // Wstępna lista bez OCR
      setResults(data);

      // Teraz wykonujemy OCR dla każdej restauracji ze zdjęciem
      const withOCR = await Promise.all(data.map(async (res) => {
        const photoRef = res.photos?.[0]?.photo_reference;
        if (!photoRef) return res;

        const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
        console.log("🧠 OCR dla:", res.name, imageUrl);
        const ocrText = await runOCR(imageUrl);
        return { ...res, ocrText };
      }));

      console.log("✅ Wyniki z OCR:", withOCR);
      setResults(withOCR);
    } catch (err) {
      console.error("❌ Błąd handleSearch:", err);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gdzie zjeść?</h1>
      <SearchBar onSearch={handleSearch} />
      <RestaurantList results={results} />
    </div>
  );
}
