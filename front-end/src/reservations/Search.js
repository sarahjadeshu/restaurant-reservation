import { useState } from "react";
import { search } from "../utils/api";
import ReservationTable from "./ReservationTable";
import ErrorAlert from "../layout/ErrorAlert";

// Search functionality for searching by mobile number

function Search() {
    const [searchNumber, setSearchNumber] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);

    function handleChange({ target: { value } }) {
        setSearchNumber(value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        const abortController = new AbortController();

        setError(null);
        const results = await search(searchNumber, abortController.signal);

        if (!results.length) {
            setError({
                message: "No reservations found."
            })
        }
        setSearchResults(results);
        return () => abortController.abort();
    }

    return (
        <div>
            <main>
            <h1 className="search-style">Search</h1>
            <div className="row">
                <form onSubmit={handleSubmit} className="col-4">
                    <label htmlFor="mobile_number">Mobile Number:</label>
                    <input
                        name="mobile_number"
                        type="text"
                        id="mobile_number"
                        value={searchNumber}
                        placeholder="Enter mobile number"
                        className="form-control"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="btn-all btn-search">
                        Submit
                    </button>
                </form>
            </div>
            <ErrorAlert error={error} />
            <ReservationTable reservations={searchResults} />
            </main>
        </div>
    )
}

export default Search;