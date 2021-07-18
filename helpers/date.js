/**
 *
 * @author Anandhakrishnan M
 * @github https://github.com/anandhakrishnanm
 *
 */

/**
 * Function to return the future after the days
 *
 * @param {Number} days The number of days from now
 * @returns Future date after days passed
 */
const getFutureDate = (days) => {
  const currentDate = Date.now();

  return new Date(currentDate + days * 86400000);
};

module.exports = { getFutureDate };
