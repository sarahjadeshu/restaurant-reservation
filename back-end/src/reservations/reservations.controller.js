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
  res.json({ data: await service.read(res.locals.reservation.reservation_id) });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data })
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

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
];

const reservationExists = async (req, res, next) => {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    next();
  } else {
    next({
      status: 404,
      message: `Sorry, no reservation found with id: ${reservation_id}`,
    });
  }
}

const hasValidProperties = (req, res, next) => {
  const { data = {} } = req.body;

  const invalid = Object.keys(data).filter((field) => !VALID_PROPERTIES.includes(field));

  if (invalid.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalid.join(", ")}`,
    });
  }

  next();
}

const hasRequiredFields = hasProperties(...VALID_PROPERTIES.slice(0, 6));

const hasValidDate = (req, res, next) => {
  const { reservation_date } = req.body.data;
  const today = new Date();
  const reservationDate = new Date(reservation_date);

  const formattedDate = /\d\d\d\d-\d\d-\d\d/;

  if (!formattedDate.test(reservation_date)) {
    next({
      status: 400,
      message: `reservation_date must be submitted in 'YYYY-MM-DD' format.`
    })
  } else if (reservationDate.getUTCDay() === 2) {
    next({
      status: 400,
      message: `Sorry, we are closed on Tuesdays. Please choose a different reservation date.`,
    })
  } else if (res.locals.reservation) {
    return next();
  } else if (reservationDate < today) {
    next({
      status: 400,
      message: `Reservation date must be made at least a day in the future.`
    })
  } else {
    next();
  }
}

const hasValidTime = (req, res, next) => {
  const { reservation_time } = req.body.data;
  const formattedTime = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;

  if (!formattedTime.test(reservation_time)) {
    next({
      status: 400,
      message: `reservation_time must be in 'HH:MM:SS' or 'HH:MM' format.`
    })
  } else if (reservation_time < "10:30" || reservation_time > "21:30") {
    next({
      status: 400,
      message: `Reservations can only be made between 10:30 AM and 9:30 PM.`
    })
  } else {
    next();
  }
}

const hasValidPeople = (req, res, next) => {
  const { people } = req.body.data;

  if (people <= 0 || typeof people !== "number") {
    next({
      status: 400,
      message: `people must include a number greater than 0.`
    })
  } else {
    next();
  }
}

const hasValidStatus = (req, res, next) => {
  const { status } = req.body.data;
  const statusProperties = ["booked", "seated", "cancelled", "finished"];

  if (!statusProperties.includes(status)) {
    return next({
      status: 400,
      message: `${status} is not a valid status.`
    })
  } else {
    next();
  }
}

const finishedUpdate = (req, res, next) => {
  const { status } = res.locals.reservation;

  if (status === "finished") {
    return next({
      status: 400,
      message: `${status} cannot be updated.`
    })
  } else {
    next();
  }
}

const isBooked = (req, res, next) => {
  const { status } = req.body.data;
  
  if (status) {
    if (status !== "booked") {
      return next({
        status: 400,
        message: `${status} is not a valid status. Reservation must begin as 'booked'.`,
      });
    }
  } else {
    next();
  }
}

const hasData = (req, res, next) => {
  const data = req.body.data;

  if (!data) {
    next({
      status: 400,
      message: `Data is required.`
    })
  } else {
    next();
  }
}



module.exports = {
  list: asyncErrorBoundary(list),
  read: [
    asyncErrorBoundary(reservationExists), 
    read,
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasRequiredFields,
    hasValidDate,
    hasValidTime,
    hasValidPeople,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    finishedUpdate,
    hasValidStatus,
    asyncErrorBoundary(update),
  ],
  create: [
    hasData,
    hasRequiredFields,
    isBooked,
    hasValidProperties,
    hasValidDate,
    hasValidTime,
    hasValidPeople,
    asyncErrorBoundary(create),
  ],
  delete: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(destroy),
  ],
};
