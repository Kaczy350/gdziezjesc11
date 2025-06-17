
export async function fetchResults(dish, city) {
  const query = encodeURIComponent(`${dish} ${city}`);
  const textSearchUrl = `/api/proxy?url=` + encodeURIComponent(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&type=restaurant&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
  );

  const res = await fetch(textSearchUrl);
  const data = await res.json();
  if (!data.results) return [];

  const enriched = await Promise.all(data.results.map(async (place) => {
    const detailsUrl = `/api/proxy?url=` + encodeURIComponent(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,photos&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );
    try {
      const detailsRes = await fetch(detailsUrl);
      const detailsData = await detailsRes.json();
      const photos = detailsData.result?.photos || [];

      return {
        ...place,
        photos: photos,
        ocrText: null,
        googleDetailsLoaded: true
      };
    } catch (e) {
      return {
        ...place,
        photos: [],
        ocrText: null,
        googleDetailsLoaded: false
      };
    }
  }));

  return enriched;
}
