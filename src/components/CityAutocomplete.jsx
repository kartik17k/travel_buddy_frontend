import React, { useState, useRef, useEffect } from "react";

const API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities";
const API_HOST = "wft-geo-db.p.rapidapi.com";
// Place your RapidAPI key here:
const API_KEY = "3dcf647066mshb536e23d2f6e1a9p190788jsnf9c847936d11";

export function CityAutocomplete({ label, value, onChange, onValid, name, required }) {
  const [input, setInput] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const debounceRef = useRef();

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!input) {
      setSuggestions([]);
      setValid(false);
      onValid && onValid(false);
      return;
    }
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch(
        `${API_URL}?limit=5&types=CITY&namePrefix=${encodeURIComponent(input)}`,
        {
          headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": API_HOST,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          const cities = (data.data || []).map(
            (c) => `${c.city}, ${c.country}`
          );
          setSuggestions(cities);
          // If input matches a suggestion, mark as valid
          const isValid = cities.includes(input);
          setValid(isValid);
          onValid && onValid(isValid);
        })
        .catch(() => setSuggestions([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line
  }, [input]);

  // Handle selection
  const handleSelect = (city) => {
    setInput(city);
    setSuggestions([]);
    setShow(false);
    setValid(true);
    onChange(city);
    onValid && onValid(true);
  };

  // Handle input change
  const handleInput = (e) => {
    setInput(e.target.value);
    setShow(true);
    onChange(e.target.value);
    setValid(false);
    onValid && onValid(false);
  };

  // Hide suggestions on blur
  const handleBlur = () => setTimeout(() => setShow(false), 100);

  return (
    <div className="city-autocomplete" style={{ position: "relative", marginBottom: 16 }}>
      <label>
        {label}
        <input
          name={name}
          value={input}
          onChange={handleInput}
          onFocus={() => setShow(true)}
          onBlur={handleBlur}
          autoComplete="off"
          required={required}
          className="city-input"
          style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
        />
      </label>
      {show && suggestions.length > 0 && (
        <ul
          className="city-suggestions"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderTop: "none",
            zIndex: 10,
            margin: 0,
            padding: 0,
            listStyle: "none",
            maxHeight: 180,
            overflowY: "auto",
          }}
        >
          {suggestions.map((city) => (
            <li
              key={city}
              onMouseDown={() => handleSelect(city)}
              style={{
                padding: 8,
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                background: city === input ? "#f0f0f0" : "#fff",
              }}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
      {loading && <div style={{ fontSize: 12, color: "#888" }}>Loading...</div>}
      {required && !valid && input && (
        <div style={{ fontSize: 12, color: "red" }}>Please select a city from the list.</div>
      )}
    </div>
  );
}
