import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

// Displays form that allows user to create a new table

function CreateTable() {
    const initialFormState = {
        table_name: "",
        capacity: "",
    }
    const history = useHistory();
    const [table, setTable] = useState({...initialFormState});
    const [error, setError] = useState(null);

    const handleChange = ({ target }) => {
        setTable({
            ...table,
            [target.name]: target.value,
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
       table.capacity = parseInt(table.capacity);
        createTable(table)
            .then(() => {
                history.push("/dashboard")
            })
            .catch(setError);
    }

    return (
        <div>
            <h1>Create A New Table</h1>
            <ErrorAlert error={error} />
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <div className="row">
                        <div className="form-group col-3">
                            <label htmlFor="table_name">Table Name</label>
                            <input
                                type="text"
                                minLength="2"
                                id="table_name"
                                name="table_name"
                                value={table.table_name}
                                className="form-control"
                                placeholder="Table Name"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group col-2">
                            <label htmlFor="capacity">Table Capacity</label>
                            <input
                                type="number"
                                id="capacity"
                                min="1"
                                name="capacity"
                                placeholder="Table capacity"
                                className="form-control"
                                value={table.capacity}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary mr-2"
                            onClick={() => history.goBack()}
                        >Cancel</button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >Submit</button>
                </fieldset>
            </form>
        </div>
    )
}

export default CreateTable;