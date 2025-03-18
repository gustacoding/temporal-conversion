const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 300 });

const getCacheTTL = (startDate, endDate) => {
  if (!startDate || !endDate) return 300;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
  if (diffDays > 60) return 3600;
  if (diffDays > 30) return 1800;
  if (diffDays > 14) return 900;
  return 300;
};

module.exports = {
  cache,
  getCacheTTL
};
