import axios from "axios";

// Live mandi prices from data.gov.in / Agmarknet
// Falls back to curated sample data if API is unavailable
const SAMPLE_PRICES = [
  { commodity: "Soybean", market: "Akola", state: "Maharashtra", price: "4820", unit: "Quintal", date: new Date().toLocaleDateString("en-IN") },
  { commodity: "Cotton", market: "Yavatmal", state: "Maharashtra", price: "6500", unit: "Quintal", date: new Date().toLocaleDateString("en-IN") },
  { commodity: "Tur Dal", market: "Latur", state: "Maharashtra", price: "7200", unit: "Quintal", date: new Date().toLocaleDateString("en-IN") },
  { commodity: "Wheat", market: "Pune", state: "Maharashtra", price: "2350", unit: "Quintal", date: new Date().toLocaleDateString("en-IN") },
  { commodity: "Onion", market: "Nashik", state: "Maharashtra", price: "1800", unit: "Quintal", date: new Date().toLocaleDateString("en-IN") },
  { commodity: "Tomato", market: "Kolhapur", state: "Maharashtra", price: "2200", unit: "Quintal", date: new Date().toLocaleDateString("en-IN") },
  { commodity: "Jowar", market: "Solapur", state: "Maharashtra", price: "2600", unit: "Quintal", date: new Date().toLocaleDateString("en-IN") },
  { commodity: "Bajra", market: "Aurangabad", state: "Maharashtra", price: "2400", unit: "Quintal", date: new Date().toLocaleDateString("en-IN") },
  { commodity: "Maize", market: "Amravati", state: "Maharashtra", price: "1950", unit: "Quintal", date: new Date().toLocaleDateString("en-IN") },
  { commodity: "Sugarcane", market: "Sangli", state: "Maharashtra", price: "3200", unit: "Quintal", date: new Date().toLocaleDateString("en-IN") },
];

export const getMandiPrices = async (req, res) => {
  try {
    const { commodity, state = "Maharashtra" } = req.query;

    // Try data.gov.in API if key is configured
    if (process.env.DATA_GOV_API_KEY) {
      const params = {
        "api-key": process.env.DATA_GOV_API_KEY,
        format: "json",
        limit: 50,
        "filters[state.keyword]": state,
      };
      if (commodity) params["filters[commodity]"] = commodity;

      const response = await axios.get(
        "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
        { params, timeout: 5000 }
      );

      if (response.data?.records?.length > 0) {
        const prices = response.data.records.map(r => ({
          commodity: r.commodity,
          market: r.market,
          state: r.state,
          price: r.modal_price,
          minPrice: r.min_price,
          maxPrice: r.max_price,
          unit: "Quintal",
          date: r.arrival_date,
        }));
        return res.json({ prices, source: "data.gov.in", live: true });
      }
    }

    // Fallback to sample data
    let prices = SAMPLE_PRICES;
    if (commodity) {
      prices = prices.filter(p => p.commodity.toLowerCase().includes(commodity.toLowerCase()));
    }
    res.json({ prices, source: "sample", live: false });
  } catch (err) {
    // Return sample data on API error
    res.json({ prices: SAMPLE_PRICES, source: "sample", live: false });
  }
};
