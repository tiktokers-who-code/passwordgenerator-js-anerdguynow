// https://www.tiktok.com/@anerdguynow

import crypto from "crypto";
import PasswordGenerator from "./password-generator.js";

const generator = new PasswordGenerator(crypto)
  .withLength(16)
  .withLowerCase()
  .withUpperCase()
  .withDigits()
  .withSpecialCharacters();

const password = generator.generatePassword();
console.log(password);
