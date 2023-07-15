const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
  const { mobile_number } = req.query;
  let data;

  if (date) {
    data = await service.listByDate(date);
  } else if (mobile_number) {
    data = await service.search(mobile_number);
  } else {
    data = await service.list();
  }

  res.json({ data });
}

module.exports = {
  list,
};
