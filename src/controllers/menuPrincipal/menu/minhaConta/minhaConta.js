const controllerMinhaConta = require("express").Router()
const dbconnection = require("../../../../database/dbconnection")
const { verificaJWTLogin } = require("../../../../functions/JWTS")
controllerMinhaConta.get("/carregar/usuario/:idUsuario", verificaJWTLogin, async function (req, res) {
    try {
        const idUsuario = req.params.idUsuario
        const SqlSelectContaUsuario = `
        SELECT 
        id_usuario,
        nome,
        email,
        avatar,
        ativo,
        dataCriacao
        FROM public.usuario
        WHERE
        id_usuario = ${idUsuario}
        `
        const usuario = (await dbconnection.query(SqlSelectContaUsuario)).rows[0]
        return res.status(200).send({
            usuario: usuario
        })
    } catch (error) {
        return res.status(500).send({
            message: "Erro ao carregar informações da conta: " + error.message || error
        })
    }
})


module.exports = controllerMinhaConta