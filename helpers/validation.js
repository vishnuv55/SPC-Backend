/**
 *
 * @param {String} data Date to be validated
 * @param {Number} minLength Minimum length of the string
 * @param {Number} maxLength Maximum length of the string
 * @param {String} fieldName Name of the field to be validated
 * @param {Boolean} isRequired Wether field is required or not
 */
const validateString = (data, minLength, maxLength, fieldName, isRequired = false) => {
  if (isRequired && data !== undefined) {
    if (data === '' || data === null) {
      throw new Error(`${fieldName} cannot be empty`);
    } else if (data.length < minLength) {
      throw new Error(`${fieldName} must contain ${minLength} characters`);
    } else if (data.length > maxLength) {
      throw new Error(`${fieldName} must not exceed ${minLength} characters`);
    }
  } else if (!isRequired) {
    if (data.length < minLength) {
      if (data !== '' || data !== null) {
        throw new Error(`${fieldName} must contain ${minLength} characters`);
      }
    } else if (data.length > maxLength) {
      throw new Error(`${fieldName} must not exceed ${minLength} characters`);
    }
  } else {
    throw new Error(`Data undefined`);
  }
};

/**
 *
 * @param {Array.<string>} array Array to validated
 * @param {Number} minLength Minimum length of each string in array
 * @param {Number} maxLength Maximum length of each string in array
 * @param {String} fieldName Name of array
 * @param {Boolean} isRequired Wether field is required or not
 */
const validateStringArray = (array, minLength, maxLength, fieldName, isRequired) => {
  if (isRequired && array !== undefined) {
    if (array !== null) {
      throw new Error(`${fieldName} cannot be null`);
    } else if (!Array.isArray(array)) {
      throw new Error(`${fieldName} must be of type array`);
    } else if (array.length !== 0) {
      array.forEach((element) => {
        validateString(element, minLength, maxLength, `Each value in ${fieldName}`, isRequired);
      });
    }
  } else {
    throw new Error(`Data undefined`);
  }
};
/**
 *
 * @param {Number} data Number to be validated
 * @param {Number} lowerLimit Lower limit of Number to be validated
 * @param {Number} upperLimit Upper limit of Number to be validated
 * @param {String} fieldName Field Name of the Number to be validated
 * @param {Boolean} isRequired Whether the data is required or not
 */
const validateNumber = (data, lowerLimit, upperLimit, fieldName, isRequired) => {
  if (!isRequired && data !== undefined) {
    if (data === '' || data === null) {
      throw new Error(`${fieldName} cannot be empty`);
    } else if (Number.isNaN(data)) {
      throw new Error(`${fieldName} not a Number`);
    } else if (data < lowerLimit || data > upperLimit) {
      throw new Error(`${fieldName} Invalid`);
    }
  } else {
    throw new Error(`${fieldName} undefined`);
  }
};

export { validateString, validateStringArray, validateNumber };
