const knex = require("../db/connection");

const list = (reservation_date) => {
    return knex("reservations")
    .select("*")
    .orderBy("reservation_time")
}

const listByDate = (reservation_date) => {
    return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .whereNot({ status: "finished" })
    .whereNot({ status: "cancelled" })
    .orderBy("reservation_time")
}

const listByMobileNumber = (mobile_number) => {
    return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date")
}

module.exports = {
    list,
    listByDate,
    listByMobileNumber,
    create,
    read,
    update,
    search,
}