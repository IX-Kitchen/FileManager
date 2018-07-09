
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const port = process.env.REACT_APP_BACK_PORT;

const hostname = window && window.location && window.location.hostname;

const backendHost =  `http://${hostname}:${port}`
console.log(backendHost)
export const BACK_ROOT = backendHost