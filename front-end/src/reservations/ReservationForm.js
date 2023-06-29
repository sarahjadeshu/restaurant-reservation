import React from "react";

function ReservationForm({ reservation, handleSubmit, handleCancel, handleChangge }) {

    return (
      <>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              className="form-control"
              name="first_name"
              id="first_name"
              value={reservation.first_name}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              className="form-control"
              name="last_name"
              id="last_name"
              value={reservation.last_name}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className="form-group">
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
              className="form-control"
              name="mobile_number"
              id="mobile_number"
              value={reservation.mobile_number}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reservation_date">Reservation Date</label>
            <input
              type="date"
              className="form-control"
              name="reservation_date"
              id="reservation_date"
              value={reservation.reservation_date}
              placeholder="YYYY-MM-DD"
              pattern="\d{4}-\d{2}-\d{2}"
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reservation_time">Reservation Time</label>
            <input
              type="time"
              className="form-control"
              name="reservation_time"
              id="reservation_time"
              value={reservation.reservation_time}
              placeholder="HH:MM"
              pattern="[0-9]{2}:[0-9]{2}"
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className="form-group">
            <label htmlFor="people">Party Size</label>
            <input
              type="number"
              className="form-control"
              name="people"
              id="people"
              value={reservation.people}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div>
            <button type="submit" className="btn btn-primary mr-2">
              Submit
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </>
    );
}

export default ReservationForm;