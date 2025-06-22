
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


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { dish, city } = req.body;

  if (!dish || !city) {
    return res.status(400).json({ error: "Missing dish or city" });
  }

  try {
    const results = await fetchResults(dish, city);
    res.status(200).json(results);
  } catch (error) {
    console.error("❌ Błąd API /search handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
