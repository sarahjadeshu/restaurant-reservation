import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationTable from "../reservations/ReservationTable";
import { listReservations, updateStatus } from "../utils/api";

function Search () {
    const [error, setError] = useState(null);
    const [mobile_number, setMobileNumber ] = useState("");
    const [reservationMobile, setReservationMobile] = useState([]);

    const handleChange = ({ target }) => {
        setMobileNumber(target.value);
    }

    const handleCancel = async (reservation) => {
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            await updateStatus("cancelled", reservation.reservation_id);
            window.location.reload();
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();

        listReservations({ mobile_number: mobile_number }, abortController.signal)
        .then((reservations) => setReservationMobile(reservations))
        .catch(setError)

        return () => abortController.abort();
    }
}