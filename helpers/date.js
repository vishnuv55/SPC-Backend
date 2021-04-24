/**
 *
 * @param {Number} days The number of days from now
 * @returns
 */
const getFutureDate = (days) => {
  const currentDate = Date.now();
  return new Date(currentDate + days * 86400000);
};

module.exports = { getFutureDate };
