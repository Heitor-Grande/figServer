const express = require("express")
const routes = express.Router()
const cors = require("cors")


routes.use(cors())

const precad = require("./controllers/precad/preCadCliente")
const criarJWTPublico = require("./controllers/public/criarJWTPublico")

routes.use(precad)
routes.use(criarJWTPublico)

module.exports = routes