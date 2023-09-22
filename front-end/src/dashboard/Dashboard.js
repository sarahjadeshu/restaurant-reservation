import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router";
import { formatAsDate, previous, next, today } from "../utils/date-time";
import ReservationTable from "../reservations/ReservationTable";
import TablesTable from "../tables/TablesTable";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  

  const query = useQuery();
  const getDate = query.get("date");
  const history = useHistory();
  let isToday = true;

  if (getDate && getDate !== today()) {
    date = getDate;
    isToday = false;
  }

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const displayDate = formatAsDate(date);
  const previousDate = previous(date);
  const nextDate = next(date);

  function adjustDate(updatedDate) {
    history.push(`/dashboard?date=${updatedDate}`);
  }

  let result = reservations.filter((reservation) => {
    return (
      reservation.status !== "finished" && reservation.status !== "cancelled"
    )
  })

  return (
    <main>
      <h1 className="dash">Dashboard</h1>
      <div className="border-style">
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {displayDate}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="btn-group" role="group" aria-label="Choose a date">
        <button className="btn-all btn-date" onClick={() => adjustDate(previousDate)}>
          Back
        </button>
        <button className="btn-all btn-date" onClick={() => history.push("/dashboard")} disabled={date === today()}>
          Today
        </button>
        <button className="btn-all btn-date" onClick={() => adjustDate(nextDate)}>
          Next
        </button>
      </div>
      <ReservationTable reservations={result} isToday={isToday} />
      {!reservations.length && <h6>No reservations available on this date.</h6>}
      </div>
      <TablesTable reservations={reservations}/>
    </main>
  );
}

export default Dashboard;
