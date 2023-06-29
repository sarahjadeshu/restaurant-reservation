import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";


// Displays the form that is used to create a new reservation

function NewReservation() {

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
        status: "booked",
    }

    const [reservation, setReservation] = useState({...initialFormState});
    const [error, setError] = useState(null);
    const history = useHistory();

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();

        createReservation(reservation, abortController.signal)
        .then(() => {
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        })
        .catch(setError)

        return () => abortController.abort();
    }

    const handleCancel = () => {
        history.push("/");
    }

    const handleChange = ({target}) => {
        setReservation({
            ...reservation,
            [target.name]: target.value
        })
    }

    return (
        <>
            <div>
                <h1>New Reservation</h1>
                <ErrorAlert error={error} />
                <ReservationForm reservation={reservation} handleSubmit={handleSubmit} handleCancel={handleCancel} handleChange={handleChange} />
            </div>
        </>
    )
}

export default NewReservation;