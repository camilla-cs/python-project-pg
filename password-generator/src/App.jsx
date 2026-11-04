
import { useState } from "react";
import { generatePassword } from "./passwordGenerator";
import "./App.css";

function App() {
  const [length, setLength] = useState(20);

  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });

  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleOptionChange = (event) => {
    const { name, checked } = event.target;

    setOptions((previous) => ({
      ...previous,
      [name]: checked,
    }));
  };

  const handleGenerate = () => {
    try {
      const newPassword = generatePassword(length, options);

      setPassword(newPassword);
      setCopied(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopy = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setError("");

      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy. Please copy the password manually.");
    }
  };

  return (
    <main className="page">
      <section className="generator">

        <div className="header">
          <div className="icon">🔐</div>
          <h1>Password Generator</h1>
          <p>Create a strong and secure password.</p>
        </div>

        <div className="password-container">
          <div className="password-output">
            <span>
              {password || "Your password will appear here"}
            </span>

            <button
              className="copy-button"
              onClick={handleCopy}
              disabled={!password}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="settings">

          <div className="length-header">
            <label htmlFor="length">Password length</label>
            <span>{length} characters</span>
          </div>

          <input
            id="length"
            type="range"
            min="8"
            max="128"
            value={length}
            onChange={(event) =>
              setLength(Number(event.target.value))
            }
          />

          <div className="range-labels">
            <span>8</span>
            <span>128</span>
          </div>

          <h2>Character types</h2>

          <div className="options">

            <label className="option">
              <input
                type="checkbox"
                name="lowercase"
                checked={options.lowercase}
                onChange={handleOptionChange}
              />
              <span>Lowercase letters</span>
              <small>abc</small>
            </label>

            <label className="option">
              <input
                type="checkbox"
                name="uppercase"
                checked={options.uppercase}
                onChange={handleOptionChange}
              />
              <span>Uppercase letters</span>
              <small>ABC</small>
            </label>

            <label className="option">
              <input
                type="checkbox"
                name="numbers"
                checked={options.numbers}
                onChange={handleOptionChange}
              />
              <span>Numbers</span>
              <small>123</small>
            </label>

            <label className="option">
              <input
                type="checkbox"
                name="symbols"
                checked={options.symbols}
                onChange={handleOptionChange}
              />
              <span>Symbols</span>
              <small>!@#</small>
            </label>

          </div>

          {error && <p className="error">{error}</p>}

          <button
            className="generate-button"
            onClick={handleGenerate}
          >
            Generate password
          </button>

        </div>

        <footer>
          Passwords are generated locally in your browser.
        </footer>

      </section>
    </main>
  );
}

export default App;
