
import { useState } from "react";
import SearchBar from "../SearchBar";
import RestaurantList from "../RestaurantList";
import { fetchResults } from "../search";
import { runOCR } from "../ocr";

export default function HomePage() {
  const [results, setResults] = useState([]);

  const handleSearch = async (dish, city) => {
    console.log("🔍 Szukam:", dish, city);
    const rawResults = await fetchResults(dish, city);
    console.log("📥 Restauracje z Google:", rawResults);

    setResults(rawResults);

    const withSmartOCR = await Promise.all(rawResults.map(async (res) => {
      if (!res.photos || res.photos.length === 0) {
        console.warn("❗ Brak zdjęć, pomijam OCR:", res.name);
        return res;
      }

      let bestMatch = "";
      for (let i = 0; i < Math.min(res.photos.length, 5); i++) {
        const ref = res.photos[i].photo_reference;
        const imgUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${ref}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
        const text = await runOCR(imgUrl);
        if (text?.toLowerCase().includes(dish.toLowerCase())) {
          bestMatch = text;
          console.log("✅ OCR pasuje do dania:", res.name, text);
          break;
        } else {
          console.log("🟡 OCR bez dopasowania:", res.name, text);
        }
      }

      return {
        ...res,
        ocrText: bestMatch || null
      };
    }));

    setResults(withSmartOCR);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gdzie zjeść?</h1>
      <SearchBar onSearch={handleSearch} />
      <RestaurantList results={results} />
    </div>
  );
}
