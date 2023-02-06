import axios from 'axios'

const api = axios.create({
    // baseURL:'http://localhost:3333'
   baseURL:'https://universo-burguer-backend.vercel.app:5000'
})

export { api }