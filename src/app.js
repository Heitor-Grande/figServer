const express = require("express")
const routes = express.Router()
const cors = require("cors")
const bodyParser = require("body-parser")

routes.use(cors())

routes.use(bodyParser.json())

const precad = require("./controllers/precad/preCadCliente")
const criarJWTPublico = require("./controllers/public/criarJWTPublico")

routes.use(precad)
routes.use(criarJWTPublico)

module.exports = routes