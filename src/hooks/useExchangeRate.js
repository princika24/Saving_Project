// Custom hook to fetch, cache and provide exchange rate
import { useState, useEffect, useCallback } from "react";

const CACHE_KEY = "exchange_rate_cache";
const CACHE_TIMESTAMP_KEY = "exchange_rate_timestamp";

const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

function useExchangeRate() {
  const [rate, setRate] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCachedData = useCallback(() => {
    try {
      const cachedRate = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

      if (cachedRate && cachedTimestamp) {
        const parsedRate = parseFloat(cachedRate);
        const parsedTimestamp = new Date(cachedTimestamp);

        if (!isNaN(parsedRate) && parsedRate > 0) {
          setRate(parsedRate);
          setLastUpdated(parsedTimestamp);
          return { rate: parsedRate, timestamp: parsedTimestamp };
        }
      }
    } catch (err) {
      console.error("Error loading cached exchange rate:", err);
    }
    return null;
  }, []);

  const saveToCache = useCallback((rateValue, timestamp) => {
    try {
      localStorage.setItem(CACHE_KEY, rateValue.toString());
      localStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp.toISOString());
    } catch (err) {
      console.error("Error saving exchange rate to cache:", err);
    }
  }, []);

  const fetchExchangeRate = useCallback(async () => {
    if (!API_KEY || API_KEY === "undefined") {
      const errorMsg =
        "API key not configured. Please add VITE_EXCHANGE_RATE_API_KEY to your .env file.";
      setError(errorMsg);
      setIsLoading(false);

      const cached = loadCachedData();
      if (cached) {
        setRate(cached.rate);
        setLastUpdated(cached.timestamp);
        setError("Using cached rate. API key not configured.");
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      if (data.result === "error") {
        throw new Error(data["error-type"] || "Unknown API error");
      }
      const inrRate = data.conversion_rates?.INR;
      if (!inrRate || isNaN(inrRate) || inrRate <= 0) {
        throw new Error("Invalid exchange rate received from API");
      }
      const timestamp = new Date();
      setRate(inrRate);
      setLastUpdated(timestamp);
      saveToCache(inrRate, timestamp);
      setError(null);
    } catch (err) {
      console.error("Error fetching exchange rate:", err);

      const cached = loadCachedData();
      if (cached) {
        setRate(cached.rate);
        setLastUpdated(cached.timestamp);
        setError(
          `Failed to fetch new rate. Using cached rate from ${cached.timestamp.toLocaleString()}. Error: ${
            err.message
          }`
        );
      } else {
        setError(err.message || "Failed to fetch exchange rate");
        setRate(null);
        setLastUpdated(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadCachedData, saveToCache]);

  useEffect(() => {
    const cached = loadCachedData();
    if (cached) {
      setRate(cached.rate);
      setLastUpdated(cached.timestamp);
      setIsLoading(false);
    }
    fetchExchangeRate();
  }, [fetchExchangeRate, loadCachedData]);

  const formatLastUpdated = useCallback(() => {
    if (!lastUpdated) return "--:--:--";

    const hours = lastUpdated.getHours().toString().padStart(2, "0");
    const minutes = lastUpdated.getMinutes().toString().padStart(2, "0");
    const seconds = lastUpdated.getSeconds().toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }, [lastUpdated]);

  return {
    rate,
    lastUpdated,
    isLoading,
    error,
    refreshRate: fetchExchangeRate,
    formatLastUpdated,
  };
}

export default useExchangeRate;
