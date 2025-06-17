
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import RestaurantList from "../components/RestaurantList";

export default function HomePage() {
  const [results, setResults] = useState([]);

  const handleSearch = async (dish, city) => {
    console.log("🔍 Szukam:", dish, city);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dish, city })
      });
      const data = await res.json();
      console.log("📥 Wyniki z Google:", data);

      // Przeprowadzenie OCR przez backend
      const ocrRes = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: data, dish })
      });
      const withOCR = await ocrRes.json();

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
