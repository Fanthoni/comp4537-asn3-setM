import axios from "axios"

const getAllPokemons = async (count, after, authToken) => {
    const BASE_AUTH_API_URL = "http://localhost:5050/api/v1/"
    return await axios.get(`${BASE_AUTH_API_URL}pokemons/`, {
        params: {count, after, authToken}
    })
}

export default getAllPokemons