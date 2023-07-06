import React from "react";

function ReservationTable({ reservations, handleCancel }) {
    const rows = reservations.map((reservation) => (
        <tr key={reservations.reservation_id}>
            <th scope="row">{reservation.reservation_id}</th>
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.people}</td>
            <td>{reservation.reservation_date}</td>
        </tr>
    ))
}