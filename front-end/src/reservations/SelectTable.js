import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { listTable, seatReservation, getReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

// Seats each reservation at a certain table

function SelectTable() {
    const [tables, setTables] = useState([]);
    const [reservation, setReservation] = useState(null);
    const [formData, setFormData] = useState({ table_id: null });
    const [error, setError] = useState(null);
    const params = useParams();
    const history = useHistory();

    function loadReservation() {
        const abortController = new AbortController();

        getReservation(params.reservation_id, abortController.signal)
        .then(setReservation)
        .catch(setError)

        return () => abortController.abort();
    }

    useEffect(loadReservation, [params.reservation_id]);

    function loadTables() {
        const abortController = new AbortController();

        listTable(abortController.signal)
        .then(setTables)
        .catch(setError)

        return () => abortController.abort();
    }

    useEffect(loadTables, []);

    function handleChange({ target }) {
        setFormData({
            ...formData,
            [target.name]: target.value,
        })
    }

    async function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        const abortController = new AbortController();

        await seatReservation(params.reservation_id, formData.table_id, abortController.signal)
        .then(() => history.push("/dashboard"))
        .catch(setError)

        return () => abortController.abort();
    }

    let selection = tables.map((table) => (
        <option key={table.table_id} value={table.table_id}>
            {table.table_name} - {table.capacity}
        </option>
    ))

    return (
        <div>
            <ErrorAlert error={error} />
            {reservation && <h3>Reservation {reservation.reservation_id} has {reservation.people} guest{reservation.people > 1 && 's'}.</h3>}
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="table_id">
                            Please select a table:
                            <select
                                onChange={handleChange}
                                id="table_id"
                                name="table_id"
                                className="form-control form-select form-select-lg"
                                size={tables.length + 1}
                                multiple 
                            >
                                <option value="">--Select a table--</option>
                                {tables.length && selection}
                            </select>
                        </label>
                    </div>
                    <button className="btn btn-secondary" onClick={() => history.push("/")}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={!formData.table_id}>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SelectTable;