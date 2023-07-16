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

async function read(req, res) {
  res.json({ data: res.locals.reservation });
}

async function create(req, res) {
  const newReservation = await service.create({
    ...req.body.data,
    status: "booked",
  })

  res.status(201).json({ data: newReservation });
}

async function update(req, res) {
  const { reservation_id } = res.locals.reservation;

  const updatedReservation = {
    ...req.body.data,
    reservation_id,
  };

  const data = await service.update(updatedReservation);
  res.json({ data });
}

async function destroy(req, res) {
  await service.destroy(res.locals.reservation.reservation_id);
  res.sendStatus(201);
}


// Validation Functions



module.exports = {
  list,
};
