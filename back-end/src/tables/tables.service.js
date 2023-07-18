const knex = require("../db/connection");

const list = () => {
    return knex("tables")
    .select("*")
    .orderBy("table_name")
}

const read = (table_id) => {
    return knex("tables")
    .select("*")
    .where({table_id})
    .first()
}

const create = (table) => {
    return knex("tables")
    .insert(table)
    .returning("*")
    .then((tableArray) => tableArray[0])
}

const destroy = (table_id) => {
    return knex("tables")
    .where({table_id})
    .del()
}

const seatUpdate = (table_id, reservation_id) => {
    return knex("tables")
    .where({table_id})
    .update({reservation_id})
    .returning("*")
    .then(() => {
        return knex("reservations")
        .where({reservation_id})
        .update({status: "seated"})
    })
}

const finishTable = (table_id, reservation_id) => {
    return knex("tables")
    .where({table_id})
    .update({reservation_id: null})
    .returning("*")
    .then(() => {
        return knex("reservations")
        .where({reservation_id})
        .update({status: "finished"})
    })
}

module.exports = {
    list,
    read,
    create,
    destroy,
    seatUpdate,
    finishTable,
}