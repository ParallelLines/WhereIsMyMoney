import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const ENDPOINT = BACKEND_URL + '/expenses'

export async function getExpenses(userId) {
    //will i need to pass the userId as a req.param? hope not
    //for now the userId is hardcoded on the server side
    //TODO change that later
    const response = await axios
        .get(ENDPOINT)
        .catch(e => console.log('Error trying to request expenses: ', e))
    return response.data
}

export async function getOneExpense(id) {
    const response = await axios
        .get(ENDPOINT + '/' + id)
        .catch(e => console.log('Error trying to request one expense: ', e))
    return response.data
}

export async function createOneExpense(userId, data) {
    const params = new URLSearchParams(data)
    const response = await axios
        .post(ENDPOINT, params)
        .catch(e => console.log('Error trying to update one expense: ', e))
    return response.status
}

export async function editOneExpense(id, updates) {
    // using URLSearchParams because I'm using application/x-www-form-urlencoded format
    // on the server and URLSearchParams was recommended in axios docs
    const params = new URLSearchParams(updates)
    const response = await axios
        .put(ENDPOINT + '/' + id, params)
        .catch(e => console.log('Error trying to update one expense: ', e))
    return response.status
}