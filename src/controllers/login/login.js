const dbconnection = require("../../database/dbconnection")
const { descriptografar } = require("../../functions/crypto")
const { verificaJWT, criaJwtLogin, verificaJWTLogin, autoLogin } = require("../../functions/JWTS")
const controllerLogin = require("express").Router()
//rota responsavel por autorizar o login
controllerLogin.post("/realizar/login", verificaJWT, async function (req, res) {
    try {
        const { senha, email } = req.body
        //consulta e-mail
        const SqlSelectusuario = `
        SELECT email, senha, id_usuario, ativo from public.usuario
        WHERE email = '${email}'
        `
        const usuarioEncontrado = (await dbconnection.query(SqlSelectusuario)).rows
        //se email existir continua login
        if (usuarioEncontrado.length == 1) {
            if (usuarioEncontrado[0].ativo == false) {
                return res.status(403).send({
                    message: "Conta bloqueada/desativada."
                })
            }
            else {
                //verificar senha
                const senhaDesc = await descriptografar(usuarioEncontrado[0].senha)
                if (senha === senhaDesc) {
                    const tokenLogin = await criaJwtLogin(email, senha, usuarioEncontrado[0].id_usuario)
                    return res.status(200).send({
                        message: "Sucesso ao realizar login",
                        tokenLogin: tokenLogin,
                        usuario: usuarioEncontrado[0]
                    })
                }
                else {
                    return res.status(403).send({
                        message: "Senha e/ou e-mail incorreto(s).",
                    })
                }
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
//verifica token login quando carrega as telas
controllerLogin.get("/verifica/login/usuario/:id_usuario", verificaJWTLogin, function (req, res) {
    return res.status(200).send({
        message: "Login valido."
    })
})
//autologin
controllerLogin.get("/logar/login/usuario", autoLogin)
module.exports = controllerLogin