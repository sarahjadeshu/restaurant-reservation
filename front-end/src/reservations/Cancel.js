import { useHistory } from "react-router-dom";
import { updateStatus } from "../utils/api";

function Cancel({ reservation_id }) {
    const history = useHistory();

    async function handleClick() {
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            const abortController = new AbortController();
            await updateStatus(reservation_id, "cancelled", abortController.signal);
            history.go(0);
            
            return () => abortController.abort();
        }
    }

    return (
        <button data-reservation-id-cancel={reservation_id} className="btn btn-danger" onClick={() => handleClick(reservation_id)}>
            Cancel
        </button>
    )
}

export default Cancel;