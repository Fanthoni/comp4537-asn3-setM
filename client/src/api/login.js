import axios from "axios"

const login = async (username, password) => {
    const BASE_AUTH_API_URL = "http://localhost:6060/"
    return await axios.post(`${BASE_AUTH_API_URL}login`, {
        username, password
    })
}

export default login