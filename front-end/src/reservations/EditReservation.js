import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { getReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

function EditReservation() {
    const [reservation, setReservation] = useState({});
    const [error, setError] = useState(null);
    const params = useParams();
    const history = useHistory();

    useEffect(loadReservation, [params.reservation_id]);

    function loadReservation() {
        const abortController = new AbortController();

        getReservation(params.reservation_id, abortController.signal)
            .then(setReservation)
            .catch(setError);

        return () => abortController.abort();
    }

    const handleChange = ({ target }) => {
        setReservation({
            ...reservation,
            [target.name]: target.value,
        })
    }
}