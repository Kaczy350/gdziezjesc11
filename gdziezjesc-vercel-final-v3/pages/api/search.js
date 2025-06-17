
export async function fetchResults(dish, city) {
  const query = encodeURIComponent(`${dish} ${city}`);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&type=restaurant&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;

  const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;

  try {
    const res = await fetch(proxyUrl);
    const data = await res.json();

    if (!data.results) return [];

    return data.results.map((place) => ({
      ...place,
      ocrText: null // zostanie wypełnione w OCR
    }));
  } catch (err) {
    console.error("❌ Błąd pobierania z Google Places:", err);
    return [];
  }
}
