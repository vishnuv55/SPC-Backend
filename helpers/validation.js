const { ErrorHandler } = require('./error');

/**
 *
 * A validator function to validate any string using character limit
 * @param {String} data Data to be validated
 * @param {Number} minLength Minimum length the string can have
 * @param {Number} maxLength Maximum length the string can have
 * @param {String} fieldName Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not
 */
const validateString = (data, minLength, maxLength, fieldName, isRequired = false) => {
  if (data !== undefined && data !== '') {
    if (typeof data !== 'string') {
      throw new ErrorHandler(400, `${fieldName} must be of type string`);
    } else if (data.length < minLength) {
      throw new ErrorHandler(400, `${fieldName} should contain at least ${minLength} characters`);
    } else if (data.length > maxLength) {
      throw new ErrorHandler(400, `${fieldName} must not exceed the ${maxLength} character limit`);
    }
  } else if (isRequired) {
    throw new ErrorHandler(400, `${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate any string using character limit
 * @param {Array.<String>} array String array to be validated
 * @param {Number} minLength Minimum length the each element in string array can have
 * @param {Number} maxLength Maximum length the each element in string array can have
 * @param {String} fieldName Field name to be displayed in error message.
 * @param {Boolean} [canBeEmpty] Whether the array can be empty or not
 * @param {Boolean} [isRequired] Is this field required or not
 */
const validateStringArray = (
  array,
  minLength,
  maxLength,
  fieldName,
  canBeEmpty = true,
  isRequired = false
) => {
  if (array !== undefined && array !== null) {
    if (!Array.isArray(array)) {
      throw new ErrorHandler(400, `${fieldName} must be of type array`);
    }
    if (array.length !== 0) {
      array.forEach((element) => {
        validateString(element, minLength, maxLength, `Each value in ${fieldName}`, isRequired);
      });
    } else if (!canBeEmpty) {
      throw new ErrorHandler(400, `${fieldName} cannot be an empty array`);
    }
  } else if (isRequired) {
    throw new ErrorHandler(400, `${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate any number using length
 * @param {Number} data Data to be validated
 * @param {Number} lowerLimit Lower limit the data can have
 * @param {Number} upperLimit Upper limit the data can have
 * @param {String} fieldName Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not
 */
const validateNumber = (data, lowerLimit, upperLimit, fieldName, isRequired = false) => {
  if (data !== undefined && data !== null) {
    if (typeof data !== 'number') {
      throw new ErrorHandler(400, `${fieldName} must be of type number`);
    } else if (data < lowerLimit || data > upperLimit) {
      throw new ErrorHandler(400, `Invalid ${fieldName}`);
    }
  } else if (isRequired) {
    throw new ErrorHandler(400, `${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate boolean
 * @param {Boolean} data Data to be validated
 * @param {String} fieldName Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not
 */
const validateBoolean = (data, fieldName, isRequired = false) => {
  if (data !== undefined && data !== null) {
    if (typeof data !== 'boolean') {
      throw new ErrorHandler(400, `${fieldName} must be of type boolean`);
    }
  } else if (isRequired) {
    throw new ErrorHandler(400, `${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate Date
 * @param {Date} date date to be validated
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not.
 */
const validateDate = (date, fieldName = 'Date', isRequired = false) => {
  if (date !== undefined && date !== null) {
    const dateObject = new Date(date);
    if (!(dateObject instanceof Date) || Number.isNaN(dateObject.getTime())) {
      throw new ErrorHandler(400, `${fieldName} must be of type Date`);
    }
  } else if (isRequired) {
    throw new ErrorHandler(400, `${fieldName} field cannot be empty`);
  }
};

/**
 *
 * Checks if the date is a valid date of birth
 * @param {Date} dateOfBirth Date of Birth to validate
 * @param {Number} [minimumAge] Minimum age the person should have
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not.
 */
const validateDateOfBirth = (
  dateOfBirth,
  minimumAge = 1,
  fieldName = 'Date of Birth',
  isRequired = false
) => {
  validateDate(dateOfBirth, fieldName, isRequired);

  if (dateOfBirth !== undefined && dateOfBirth !== null) {
    const currentDate = new Date();
    const minimumDOB = new Date();

    // Converting to date object
    const dateOfBirthObject = new Date(dateOfBirth);

    minimumDOB.setFullYear(currentDate.getFullYear() - minimumAge);

    if (minimumDOB.getTime() < dateOfBirthObject.getTime()) {
      throw new ErrorHandler(400, `The person should be at least ${minimumAge} years old.`);
    }
  } else if (isRequired) {
    throw new ErrorHandler(400, `${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate Name
 * @param {String} name Name to be validated
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not.
 */
const validateName = (name, fieldName = 'Name', isRequired = false) => {
  if (name !== undefined && name !== '') {
    if (typeof name !== 'string') {
      throw new ErrorHandler(400, `${fieldName} must be of type string`);
    } else if (name.length > 30) {
      throw new ErrorHandler(400, `${fieldName} must not exceed the 30 character limit`);
    } else if (!/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name)) {
      throw new ErrorHandler(400, `Invalid ${fieldName}`);
    }
  } else if (isRequired) {
    throw new ErrorHandler(400, `${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate Email Address
 * @param {String} email Email to be validated
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not
 */
const validateEmail = (email, fieldName = 'Email', isRequired = false) => {
  if (email !== undefined && email !== '') {
    if (typeof email !== 'string') {
      throw new ErrorHandler(400, `${fieldName} must be of type string`);
    } else if (email.length > 100) {
      throw new ErrorHandler(400, `${fieldName} must not exceed the 100 character limit`);
    } else if (!/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email)) {
      throw new ErrorHandler(400, `Invalid ${fieldName}`);
    }
  } else if (isRequired) {
    throw new ErrorHandler(400, `${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate Phone number
 * @param {String | Number} phoneNumber Phone number to be validated
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not
 */
const validatePhone = (phoneNumber, fieldName = 'Phone Number', isRequired = false) => {
  if (phoneNumber !== undefined && phoneNumber !== '' && phoneNumber !== null) {
    if (!/^\d{10}$/.test(phoneNumber)) {
      throw new ErrorHandler(400, `Invalid ${fieldName}`);
    }
  } else if (isRequired) {
    throw new ErrorHandler(400, `${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate Gender
 * @param {String } gender Phone number to be validated
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not
 */
const validateGender = (gender, fieldName = 'Gender', isRequired = false) => {
  const genderList = ['male', 'female', 'other'];
  if (gender !== undefined && gender !== null) {
    if (!genderList.includes(gender)) {
      throw new ErrorHandler(400, `Invalid ${fieldName}`);
    }
  } else if (isRequired) {
    throw new ErrorHandler(400, `${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate Password
 * @param {String} password Password to be validated
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not
 */
const validatePassword = (password, fieldName = 'Password', isRequired = false) => {
  if (password !== undefined && password !== '') {
    if (typeof password !== 'string') {
      throw new ErrorHandler(400, `${fieldName} must be of type string`);
    } else if (password.length > 50) {
      throw new ErrorHandler(400, `${fieldName} must not exceed the 50 character limit`);
    } else if (password.length < 6) {
      throw new ErrorHandler(400, `${fieldName} must contain 6 characters`);
    }
  } else if (isRequired) {
    throw new ErrorHandler(400, `${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate ID
 * @param {String} id ID to be validated
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not
 */
const validateMongooseId = (id, fieldName = 'Id', isRequired = false) => {
  if (id !== undefined && id !== '') {
    if (typeof id !== 'string') {
      throw new ErrorHandler(400, `${fieldName} must be of type string`);
    } else if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new ErrorHandler(400, `Invalid ${fieldName}`);
    }
  } else if (isRequired) {
    throw new ErrorHandler(400, `${fieldName} field cannot be empty`);
  }
};

const validateProjects = (
  projects,
  minNameLength = 3,
  maxNameLength = 50,
  minDescriptionLength = 10,
  maxDescriptionLength = 300,
  canBeEmpty = true,
  isRequired = false
) => {
  if (projects !== undefined && projects !== null) {
    if (!Array.isArray(projects)) {
      throw new ErrorHandler(400, `Projects must be of type array`);
    }
    if (projects.length !== 0) {
      projects.forEach((project) => {
        validateString(project.project_name, minNameLength, maxNameLength, 'Project Name', true);
        validateString(
          project.project_description,
          minDescriptionLength,
          maxDescriptionLength,
          'Project Description',
          false
        );
        validateString(project.url, 5, 1000, 'Project URL', false);
      });
    } else if (!canBeEmpty) {
      throw new ErrorHandler(400, `Projects cannot be an empty array`);
    }
  } else if (isRequired) {
    throw new ErrorHandler(400, `Projects field cannot be empty`);
  }
};

module.exports = {
  validateString,
  validateStringArray,
  validateNumber,
  validateBoolean,
  validateDate,
  validateEmail,
  validateDateOfBirth,
  validateGender,
  validatePassword,
  validateMongooseId,
  validatePhone,
  validateName,
  validateProjects,
};
