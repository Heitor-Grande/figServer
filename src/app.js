const express = require("express")
const routes = express.Router()
const cors = require("cors")
const bodyParser = require("body-parser")

routes.use(cors())

routes.use(bodyParser.json({ limit: "10mb" }))

const precad = require("./controllers/cadConta/preCadCliente")
const criarJWTPublico = require("./controllers/public/criarJWTPublico")
const controllerLogin = require("./controllers/login/login")
const recSenha = require("./controllers/login/recsenha")
const controllerMinhaConta = require("./controllers/menuPrincipal/menu/minhaConta/minhaConta")
const controllerControleCaixa = require("./controllers/menuPrincipal/menu/controleCaixa/controleCaixa")
const controllerMeusArquivos = require("./controllers/menuPrincipal/menu/meusArquivos/meusArquivos")
const controllerPrincipal = require("./controllers/menuPrincipal/principal")

routes.use(precad)
routes.use(criarJWTPublico)
routes.use(controllerLogin)
routes.use(recSenha)
routes.use(controllerMinhaConta)
routes.use(controllerControleCaixa)
routes.use(controllerMeusArquivos)
routes.use(controllerPrincipal)
module.exports = routes