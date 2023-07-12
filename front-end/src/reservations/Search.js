import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationTable from "../reservations/ReservationTable";
import { listReservations, updateStatus } from "../utils/api";

function Search () {
    const [error, setError] = useState(null);
    const [mobile_number, setMobileNumber ] = useState("");

    const handleChange = ({ target }) => {
        setMobileNumber(target.value);
    }
}