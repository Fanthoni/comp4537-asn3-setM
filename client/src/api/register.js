import axios from "axios"

const register = async (username, password, email, userType = "User") => {
    const BASE_AUTH_API_URL = "http://localhost:6060/"
    return await axios.post(`${BASE_AUTH_API_URL}register`, {
        username, password, email, userType
    })
}

export default register