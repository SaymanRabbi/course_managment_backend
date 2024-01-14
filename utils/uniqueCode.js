exports.generateUniqueCode = () => {
  // Get current timestamp
  const timestamp = new Date().getTime();

  // Generate a random number between 100,000 and 999,999 (inclusive)
  const randomNum = Math.floor(Math.random() * 900000) + 100000;

  // Combine timestamp and random number
  const uniqueCode = timestamp.toString() + randomNum.toString();

  return uniqueCode.substr(-6); // Extract the last 6 digits
};
