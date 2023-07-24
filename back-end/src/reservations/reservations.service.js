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

const search = (mobile_number) => {
    return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date")
}

const create = (newReservation) => {
  return knex("reservations")
    .insert(newReservation, "*")
    .then((createdReservations) => createdReservations[0]);
};

const read = (reservation_id) => {
    return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .first()
}

const update = (updatedReservation) => {
    return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation)
    .returning("*")
    .then((newReservations) => newReservations[0])
}

const destroy = (reservation_id) => {
    return knex("reservations")
    .where({ reservation_id })
    .del()
}

module.exports = {
    list,
    listByDate,
    search,
    create,
    read,
    update,
    destroy,
}
