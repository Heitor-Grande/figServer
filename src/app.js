const express = require("express")
const routes = express.Router()


const precad = require("./controllers/precad/preCadCliente")
routes.use(precad)

module.exports = routes