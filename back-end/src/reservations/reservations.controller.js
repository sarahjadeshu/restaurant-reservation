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

const create = async (req, res) => {
  let {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data;

  const reservationData = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status: "booked",
  };
  const newReservation = await service.create(reservationData);
  
  res.status(201).json({ data: newReservation });
};

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

// Checks to see if if the reservation exists

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
};

// Checks to see if the reservation has all valid properties

const hasValidProperties = async (req, res, next) => {
  const { data = {} } = req.body;

  const invalid = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalid.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalid.join(", ")}`,
    });
  }

  next();
};



const hasRequiredFields = hasProperties(...VALID_PROPERTIES.slice(0, 6));

// Checks to see if the reservation has a valid date

const hasValidDate = async (req, res, next) => {
  const { reservation_date } = req.body.data;
  const today = new Date();
  const reservationDate = new Date(reservation_date);

  const formattedDate = /\d\d\d\d-\d\d-\d\d/;

  if (!formattedDate.test(reservation_date)) {
    next({
      status: 400,
      message: `reservation_date must be submitted in 'YYYY-MM-DD' format.`,
    });
  } else if (reservationDate.getUTCDay() === 2) {
    next({
      status: 400,
      message: `Sorry, we are closed on Tuesdays. Please choose a different reservation date.`,
    });
  }else if (reservationDate < today) {
    next({
      status: 400,
      message: `Reservation date must be made at least a day in the future.`,
    });
  } 
  else if (res.locals.reservation) {
    return next();
  }  else {
    next();
  }
};

// Checks to see if the reservation has a valid time

const hasValidTime = async (req, res, next) => {
  const { reservation_time } = req.body.data;
  const formattedTime = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;

  if (!formattedTime.test(reservation_time)) {
    next({
      status: 400,
      message: `reservation_time must be in 'HH:MM:SS' or 'HH:MM' format.`,
    });
  } else if (reservation_time < "10:30" || reservation_time > "21:30") {
    next({
      status: 400,
      message: `Reservations can only be made between 10:30 AM and 9:30 PM.`,
    });
  } else {
    next();
  }
};

// Checks to see if the mobile number is valid

const mobileNumberExists = async(req, res, next) =>{
   const { mobile_number } = req.body.data;
  const numberRegex = new RegExp(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/);
  if(mobile_number.match(numberRegex)){
    return next()
  } else{
    return next({
      message: "mobile_number must be a number",
      status: 400
    })
  }

}

// Checks to see if people exists
// Checks to see if people is a number

const peopleExists = async(req, res, next) =>{
  let { people } = req.body.data;
  if (people && typeof people === 'number') {
    if(people > 0){
      return next();
    }
  } else {
    return next({
      message: "Body of Data must contain a number of people",
      status: 400,
    });
  }
}

// Checks to see if status is one of the properties

const hasValidStatus = async (req, res, next) => {
  const { status } = req.body.data;
  const statusProperties = ["booked", "seated", "cancelled", "finished"];

  if (!statusProperties.includes(status)) {
    return next({
      status: 400,
      message: `${status} is not a valid status.`,
    });
  } else {
    next();
  }
};

const finishedUpdate = async (req, res, next) => {
  const { status } = res.locals.reservation;

  if (status === "finished") {
    return next({
      status: 400,
      message: `${status} cannot be updated.`,
    });
  } else {
    next();
  }
};



const isBooked = async (req, res, next) => {
  if (req.body.data.status) {
    const { status } = req.body.data;
    if (status === "booked") {
      return next();
    } else {
      return next({
        message: `Status must be booked and not ${status}`,
        status: 400,
      });
    }
  } else {
    return next();
  }
}

const hasData = async (req, res, next) => {
  const data = req.body.data;

  if (!data) {
    next({
      status: 400,
      message: `Data is required.`,
    });
  } else {
    next();
  }
};

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(hasRequiredFields),
    asyncErrorBoundary(peopleExists),
    asyncErrorBoundary(hasValidDate),
    asyncErrorBoundary(hasValidTime),
    asyncErrorBoundary(mobileNumberExists),
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(finishedUpdate),
    asyncErrorBoundary(hasValidStatus),
    asyncErrorBoundary(update),
  ],
  create: [
    asyncErrorBoundary(hasData),
    asyncErrorBoundary(hasRequiredFields),
    asyncErrorBoundary(isBooked),
    asyncErrorBoundary(hasValidProperties),
    asyncErrorBoundary(peopleExists),
    asyncErrorBoundary(hasValidDate),
    asyncErrorBoundary(hasValidTime),
    asyncErrorBoundary(mobileNumberExists),
    asyncErrorBoundary(create),
  ],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
};
