import { GET_ERRORS } from "./types";
import axios from "axios";

// Register User

// The registerUser receive data in params
// And return the type of action, with the payload: userData
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
