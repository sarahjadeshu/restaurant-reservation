import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

// Functionality for creating a new reservation using ReservationForm component

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


    // Submit handler for new reservation form
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();

        reservation.people = parseInt(reservation.people)

        createReservation(reservation, abortController.signal)
        .then(() => {
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        })
        .catch(setError)

        return () => abortController.abort();
    }

    // Cancel handler, returns to home page

    const handleCancel = () => {
        history.push("/");
    }

    // Change handler

    const handleChange = ({target}) => {
        setReservation({
            ...reservation,
            [target.name]: target.value
        })
        console.log(typeof target.value)
    }

    return (
        <>
        <main>
            <div>
                <h1>New Reservation</h1>
                <ErrorAlert error={error} />
                <ReservationForm reservation={reservation} handleSubmit={handleSubmit} handleCancel={handleCancel} handleChange={handleChange} />
            </div>
        </main>
        </>
    )
}

export default NewReservation;