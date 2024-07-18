import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const ENDPOINT = BACKEND_URL + '/categories'

export async function getCategories(userId) {
    //will i need to pass the userId as a req.param? hope not
    //for now the userId is hardcoded on the server side
    //TODO change that later
    // const response = await axios.get(ENDPOINT)
    //     .catch(e => console.log('Error trying to request categories: ', e))
    // return response.data

    return axios.get(ENDPOINT)
} 