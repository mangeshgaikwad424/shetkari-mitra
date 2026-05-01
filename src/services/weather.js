const API_KEY = "9e55435e4cd6c95ab57d8f38d43553d3";

export const getWeather = async (city = "washim") => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
  );

  const data = await res.json();
  return data;
};