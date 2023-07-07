import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

function CreateTable() {
    const initialFormState = {
        table_name: "",
        capacity: "",
    }
    const history = useHistory();
    const [table, setTable] = useState({...initialFormState});
    
}