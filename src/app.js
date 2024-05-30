const express = require("express")
const routes = express.Router()


const precad = require("./controllers/precad/preCadCliente")
const criarJWTPublico = require("./controllers/public/criarJWTPublico")

routes.use(precad)
routes.use(criarJWTPublico)

module.exports = routes