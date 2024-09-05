const express = require("express")
const routes = express.Router()
const cors = require("cors")
const bodyParser = require("body-parser")

routes.use(cors())

routes.use(bodyParser.json())

const precad = require("./controllers/cadConta/preCadCliente")
const criarJWTPublico = require("./controllers/public/criarJWTPublico")
const controllerLogin = require("./controllers/login/login")
const recSenha = require("./controllers/login/recsenha")

routes.use(precad)
routes.use(criarJWTPublico)
routes.use(controllerLogin)
routes.use(recSenha)
module.exports = routes