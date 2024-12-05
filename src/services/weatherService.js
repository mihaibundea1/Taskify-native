// weatherService.js

const API_KEY = process.env.OPENWEATHERMAP_API_KEY || 'your-api-key';

export async function getCurrentWeather(lat, lon, targetDate, isForecast) {
  try {
    let url;
    if (isForecast) {
      // Using forecast API for future dates
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=ro`;
    } else {
      // Using current weather API
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=ro`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Eroare la obținerea datelor meteo');
    }
    
    const data = await response.json();
    
    if (isForecast) {
      // Find the forecast closest to desired date and time
      const targetTimestamp = targetDate.getTime();
      const closestForecast = data.list.reduce((prev, curr) => {
        const prevDiff = Math.abs(new Date(prev.dt * 1000).getTime() - targetTimestamp);
        const currDiff = Math.abs(new Date(curr.dt * 1000).getTime() - targetTimestamp);
        return currDiff < prevDiff ? curr : prev;
      });
      
      return {
        temperature: Math.round(closestForecast.main.temp),
        description: closestForecast.weather[0].description,
        icon: closestForecast.weather[0].icon,
        city: data.city.name
      };
    }
    
    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      city: data.name
    };
  } catch (error) {
    console.error('Eroare:', error);
    throw error;
  }
}
