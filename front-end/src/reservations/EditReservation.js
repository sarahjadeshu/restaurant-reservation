import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { getReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

