import axios from "axios";
const instance = axios.create({
    baseURL: "https://akbaatcheet.herokuapp.com/api"
})
export default instance;