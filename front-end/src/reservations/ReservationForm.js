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
            </form>
        </>
    )
}