import axios from "axios";

const setAuthToken = token => {
  if (token) {
    // Aplly to every request
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
