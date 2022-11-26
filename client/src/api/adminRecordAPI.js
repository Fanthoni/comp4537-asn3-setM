import axios from "axios"

const getAPIRecords = async (authToken) => {
    const BASE_POKEMON_API_URL = "http://localhost:5050/api/v1/"
    const APIrecords = await axios.get(`${BASE_POKEMON_API_URL}APIrecords`, {params: {authToken}})
    return APIrecords;
}

export default getAPIRecords;