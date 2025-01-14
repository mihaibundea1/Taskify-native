// hooks/useWeather.js
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { getCurrentWeather } from '../services/weatherService';

export function useWeather(selectedDate) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        
        // Obținem permisiunea pentru locație
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Permission to access location was denied');
        }

        // Obținem locația curentă
        let location = await Location.getCurrentPositionAsync({});
        
        // Verificăm dacă data selectată este în viitor
        const today = new Date();
        const targetDate = new Date(selectedDate);
        const isForecast = targetDate.getTime() > today.getTime();

        // Obținem datele meteo
        const weatherData = await getCurrentWeather(
          location.coords.latitude,
          location.coords.longitude,
          targetDate,
          isForecast
        );

        setWeather(weatherData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [selectedDate]);

  return { weather, loading, error };
}