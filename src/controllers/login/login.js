const dbconnection = require("../../database/dbconnection")
const { descriptografar } = require("../../functions/crypto")
const { verificaJWT, criaJwtLogin } = require("../../functions/JWTS")
const controllerLogin = require("express").Router()
//rota responsavel por autorizar o login
controllerLogin.post("/realizar/login", verificaJWT, async function (req, res) {
    try {
        const { senha, email } = req.body
        //consulta e-mail
        const SqlSelectusuario = `
        SELECT email, senha from public.usuario
        WHERE email = '${email}'
        `
        const usuarioEncontrado = (await dbconnection.query(SqlSelectusuario)).rows
        //se email existir continua login
        if (usuarioEncontrado.length == 1) {
            //verificar senha
            const senhaDesc = await descriptografar(usuarioEncontrado[0].senha)
            if (senha == senhaDesc) {
                const tokenLogin = await criaJwtLogin(email, senha)
                return res.status(200).send({
                    message: "Sucesso ao realizar login",
                    tokenLogin: tokenLogin
                })
            }
            else {
                return res.status(403).send({
                    message: "Senha e/ou e-mail incorreto(s).",
                })
            }
        }
        else {
            //se email nao existir, envio mensagem
            return res.status(400).send({
                message: "Senha e/ou e-mail incorreto(s)."
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: "Erro ao realizar login: " + error.message ? error.message : error
        })
    }
})

module.exports = controllerLogin