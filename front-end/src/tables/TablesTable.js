import { listTable } from "../utils/api";
import { useState, useEffect } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import ClearButton from "../layout/ClearButton";

// Displays the available tables

function TablesTable({reservations}) {
    const [tables, setTables] = useState([]);
    const [error, setError] = useState(null);
    console.log(reservations)

    useEffect(loadTables, []);

    function loadTables() {
        const abortController = new AbortController();
        listTable(abortController.signal)
        .then(setTables)
        .catch(setError);

        return () => abortController.abort();
    }

    let display;

    if (tables.length) {
        display = tables.map((table) => {
            let badge;
            table.reservation_id ? badge = "badge badge-secondary" : badge = "badge badge-primary";
            return (
                <tr key={table.table_id}>
                    <td>{table.table_name}</td>
                    <td>{table.capacity}</td>
                    <td data-table-id-status={table.table_id}>
                        <h6 className={badge}>
                            {table.reservation_id ? "Occupied" : "Free"}
                        </h6>
                    </td>
                    <td>
                        {table.reservation_id ? (
                            <ClearButton table_id={table.table_id} />
                        ) : null}
                    </td>
                </tr>
            )
        })
    }

    return (
        <div>
            <h1>Tables</h1>
            <ErrorAlert error={error} />
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Table</th>
                        <th scope="col">Capacity</th>
                        <th scope="col">Occupied</th>
                        <th scope="col">Clear Table</th>
                    </tr>
                </thead>
                <tbody>{tables.length ? display : null}</tbody>
            </table>
            {!tables.length && "Please add at least 1 table."}
        </div>
    )
}

export default TablesTable;