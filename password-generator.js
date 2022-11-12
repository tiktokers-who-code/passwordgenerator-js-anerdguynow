// https://www.tiktok.com/@anerdguynow

export default class PasswordGenerator {
  #ascii = {
    lowerCase: {
      a: "a".codePointAt(),
      z: "z".codePointAt(),
    },
    upperCase: {
      a: "A".codePointAt(),
      z: "Z".codePointAt(),
    },
  };

  #crypto;
  #length = 16;
  #useLowerCase = false;
  #useUpperCase = false;
  #useDigits = false;
  #useSpecialCharacters = false;
  #specialCharactersArray = "!@#$%^&*".split("");

  /**
   * Creates an instance of PasswordGenerator.
   * @param {*} crypto The 'crypto' object, either from Node or the browser.
   */
  constructor(crypto) {
    this.#crypto = crypto;
  }

  withLength = (length) => {
    this.#length = length;
    return this;
  };

  withLowerCase = () => {
    this.#useLowerCase = true;
    return this;
  };

  withUpperCase = () => {
    this.#useUpperCase = true;
    return this;
  };

  withDigits = () => {
    this.#useDigits = true;
    return this;
  };

  withSpecialCharacters = () => {
    this.#useSpecialCharacters = true;
    return this;
  };

  setSpecialCharacters = (specialCharactersArray) => {
    this.#specialCharactersArray = specialCharactersArray;
    return this;
  };

  generatePassword = () => {
    if (!Number.isInteger(this.#length)) {
      throw "Length must be an integer";
    }

    if (this.#length < 0) {
      throw "Length must be non-negative";
    }

    const generatorFunctions = this.#getGeneratorFunctions();
    if (!generatorFunctions.length) {
      throw "At least one character set must be requested";
    }

    const characters = [];
    for (let i = 0; i < this.#length; i++) {
      const generatorFunction = this.#getRandomValueFromArray(generatorFunctions);
      const character = generatorFunction();
      characters.push(character);
    }

    return characters.join("");
  };

  #generateLowerCaseCharacter = () => {
    const asciiCode = this.#getRandomIntegerInclusive(
      this.#ascii.lowerCase.a,
      this.#ascii.lowerCase.z
    );
    return String.fromCharCode(asciiCode);
  };

  #generateUpperCaseCharacter = () => {
    const asciiCode = this.#getRandomIntegerInclusive(
      this.#ascii.upperCase.a,
      this.#ascii.upperCase.z
    );
    return String.fromCharCode(asciiCode);
  };

  #generateDigit = () => this.#getRandomIntegerInclusive(0, 9).toString();

  #getRandomValueFromArray = (array) => {
    const index = this.#getRandomIntegerInclusive(0, array.length - 1);
    return array[index];
  };

  #generateSpecialCharacter = () => this.#getRandomValueFromArray(this.#specialCharactersArray);

  #getRandomIntegerInclusive = (min, max) => {
    if (min === max) {
      return min;
    }

    if (this.#crypto.randomInt) {
      return this.#crypto.randomInt(min, max + 1);
    }

    // https://stackoverflow.com/a/42321673
    const buffer = new Uint32Array(1);
    this.#crypto.getRandomValues(buffer);

    const randomNumber = buffer[0] / (0xffffffff + 1);

    return min + Math.floor(randomNumber * (max - min + 1));
  };

  #getGeneratorFunctions = (characterSetConfig) => {
    const generatorFunctions = [];
    if (this.#useLowerCase) {
      generatorFunctions.push(this.#generateLowerCaseCharacter);
    }

    if (this.#useUpperCase) {
      generatorFunctions.push(this.#generateUpperCaseCharacter);
    }

    if (this.#useDigits) {
      generatorFunctions.push(this.#generateDigit);
    }

    if (this.#useSpecialCharacters) {
      generatorFunctions.push(this.#generateSpecialCharacter);
    }

    return generatorFunctions;
  };
}
