const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
    res.json({ data: await service.list() });
}

async function create(req, res, next) {
    const data = await service.create(req.body.data);

    res.status(201).json({ data });
}

async function update(req, res, next) {
    const { reservation_id } = res.locals.reservation;
    const { table_id } = req.params;

    res.json({ data: await service.seatUpdate(Number(table_id), reservation_id) })
}

async function destroy(req, res, next) {
    const { reservation_id, table_id } = res.locals.table;

    res.status(200).json({ data: await service.finishTable(Number(table_id), reservation_id)})
}


// Validation Functions

const VALID_PROPERTIES = [
    "table_name",
    "capacity",
    "reservation_id",
]

const hasValidProperties = (req, res, next) => {
    const { data = {} } = req.body;

    const invalid = Object.keys(data).filter((field) => !VALID_PROPERTIES.includes(field))

    if (invalid.length) {
        return next({
            status: 400,
            message: `Invalid field(s): ${invalid.join(", ")}`
        })
    } else {
        next();
    }
}

const hasRequiredFieldsForCreate = hasProperties(...VALID_PROPERTIES.slice(0, 2))

const hasRequiredFieldsForUpdate = hasProperties(...VALID_PROPERTIES.slice(2))

const reservationExists = async (req, res, next) => {
    const { reservation_id } = req.body.data;
    const reservation = await reservationsService.read(reservation_id);

    if (reservation) {
        res.locals.reservation = reservation;
        next();
    } else {
        next({
            status: 404,
            message: `Sorry, no reservation was found with id: ${reservation_id}.`
        })
    }
}

const tableExists = async (req, res, next) => {
    const { table_id } = req.params;
    const table = await service.read(table_id);

    if (table) {
        res.locals.table = table;
        next();
    } else {
        next({
            status: 404,
            message: `Sorry, no table was found with id: ${table_id}.`
        })
    }
}

const hasPayload = (req, res, next) => {
    const data = req.body.data;

    if (!data) {
        next({
            status: 400,
            message: "Data is required for a valid request."
        })
    } else {
        next();
    }
}

const hasValidTableName = (req, res, next) => {
    const { table_name } = req.body.data;

    if (!table_name || table_name.length <= 1) {
        return next({
            status: 400,
            message: "table_name must be at least 2 characters."
        })
    } else {
        next();
    }
}

const hasValidCapacity = async (req, res, next) => {
    const { capacity } = req.body.data;

    if (!capacity || capacity <= 0 || typeof capacity !== "number") {
        return next({
            status: 400,
            message: "capacity must be a number greater than 0."
        })
    } else {
        next();
    }
}

const hasValidStatus = async (req, res, next) => {
    const { status } = res.locals.reservation;

    console.log(status)
    if (status !== "booked") {
        return next({
            status: 400,
            message: `Reservations cannot be seated with this status: ${status}.`
        })
    } else {
        next();
    }
}

const isAtCapacity = async (req, res, next) => {
    const { capacity } = res.locals.table;
    const { people } = res.locals.reservation;

    if (people > capacity) {
        return next({
            status: 400,
            message: "people must be less than capacity."
        })
    } else {
        next();
    }
}

const isOccupied = async (req, res, next) => {
    const { reservation_id } = res.locals.table;

    if (reservation_id) {
        return next({
            status: 400,
            message: "Sorry, this table is already occupied."
        })
    } else {
        next();
    }
}

const isNotOccupied = async (req, res, next) => {
    const { reservation_id } = res.locals.table;

    if (!reservation_id) {
        return next({
            status: 400,
            message: "Table is not occupied. It must be occupied in order to be cleared."
        })
    } else {
        next();
    }
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        hasPayload,
        hasRequiredFieldsForCreate,
        hasValidProperties,
        hasValidTableName,
        asyncErrorBoundary(hasValidCapacity),
        asyncErrorBoundary(create),
    ],
    update: [
        hasPayload,
        asyncErrorBoundary(tableExists),
        hasRequiredFieldsForUpdate,
        asyncErrorBoundary(reservationExists),
        hasValidProperties,
        asyncErrorBoundary(hasValidStatus),
        asyncErrorBoundary(isAtCapacity),
        asyncErrorBoundary(isOccupied),
        asyncErrorBoundary(update),
    ],
    delete: [
        asyncErrorBoundary(tableExists),
        asyncErrorBoundary(isNotOccupied),
        asyncErrorBoundary(destroy),
    ]
}