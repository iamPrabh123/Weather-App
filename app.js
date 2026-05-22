const searchButton = document.querySelector("#search");
const clearHistory = document.querySelector("#clearHistory");
let input = document.querySelector("#city");
let locate = document.querySelector("#location");
const temp = document.querySelector("#temperature");
const result = document.querySelector("#result");
const div = document.querySelector(".weather-info");
const para = document.querySelector(".para");
const pastTemp = document.querySelector(".past-temp");
/////////////////////////////////////////////////////////////////
searchButton.addEventListener("click", getCoordinates);

async function getCoordinates() {
  const cityInput = document.getElementById("city").value.trim();
  let lat = 28.4089;
  let lon = 77.3178;

  if (cityInput) {
    locate.innerText = cityInput;
  }

  if (cityInput === "") {
    result.innerText = "";
    return;
  }

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}`,
    );
    input.value = "";
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      temp.innerText = "Enter correct city name";
      locate.innerText = "";
      return;
    }
    lat = data.results[0].latitude;
    lon = data.results[0].longitude;
  } catch (err) {
    alert("Error:", err);
  }

  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`,
  );
  const weatherData = await weatherResponse.json(); // Convert to JSON
  const temperature = Math.trunc(weatherData.current.temperature);

  document.getElementById("temperature").innerText =
    `Temperature: ${temperature}°C`;

  const historyItem = document.createElement("div");
  historyItem.className = "history-item";

  const citySpan = document.createElement("span");
  citySpan.textContent = cityInput;

  const tempSpan = document.createElement("span");
  tempSpan.textContent = `${temperature}°C`;

  historyItem.appendChild(citySpan);
  historyItem.appendChild(tempSpan);

  document.getElementById("historyList").appendChild(historyItem);
}

getCoordinates()
  .then((coords) => console.log(coords))
  .catch((err) => console.error(err));

clearHistory.addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("historyList").innerHTML = "";
  document.getElementById("temperature").innerText = "";
  document.getElementById("location").innerText = "History Cleared";
});
