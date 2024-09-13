const controllerMinhaConta = require("express").Router()
const dbconnection = require("../../../../database/dbconnection")
const { verificaJWTLogin } = require("../../../../functions/JWTS")
//carrega informações da conta
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
//criar rota put de informações da conta
controllerMinhaConta.put("/atualizar/minha/conta/:idUsuario", verificaJWTLogin, async function (req, res) {
    try {
        const inputsConta = req.body.inputsConta
        const SqlUpdateConta = `UPDATE public.usuario
        SET
        nome = '${inputsConta.nome}',
        email= '${inputsConta.email}',
        avatar = '${inputsConta.avatar}'
        WHERE id_usuario = ${req.params.idUsuario}
        `
        await dbconnection.query(SqlUpdateConta)
        return res.status(200).send({
            message: "Informações atualizadas com sucesso."
        })
    } catch (error) {
        return res.status(500).send({
            message: "Erro ao atualizar conta: " + error.message || error
        })
    }
})
module.exports = controllerMinhaConta