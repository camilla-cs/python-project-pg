const characterSets = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+[]{}|;:,.<>?/~`-='
};

// Cryptographically secure random integer in [0, max). 
function secureRandomInt(max) {
    if (!Number.isInteger(max) || max < 1 || max > 0x100000000) {
        throw new Error('Invalid Number Range');
    }

    const range = 0x100000000; 
    const limit = Math.floor(range / max) * max;
    const values = new Uint32Array(1);

    do {
        crypto.getRandomValues(values);
    } while (values[0] >= limit);

    return values[0] % max;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = secureRandomInt(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function generatePassword(length, options) {
    if (!Number.isInteger(length) || length < 8 || length > 128) {
        throw new Error('Password length must be an integer between 8 and 128.');
    }

    const selectedSets = Object.entries(options)
    .filter(([_, enabled])=> enabled)
    .map(([key]) => characterSets[key]);

    if (selectedSets.length === 0) {
        throw new Error('At least one character set must be selected.');
    }

    if (length < selectedSets.length) {
        throw new Error(`Password is too short.`);

    
    }

  // Guarantee at least one character from each selected category.
  const passwordCharacters = selectedSets.map((set) => {
    return set[secureRandomInt(set.length)];
  });

  // Combine all selected character sets.
  const allCharacters = selectedSets.join("");

  // Fill the remaining password length.
  while (passwordCharacters.length < length) {
    passwordCharacters.push(
      allCharacters[secureRandomInt(allCharacters.length)]
    );
  }

  // Randomise the final character order.
  return shuffleArray(passwordCharacters).join("");
}
