const jwt = require("jsonwebtoken")
//verifica jwt publico ou de login
function verificaJWT(req, res, next) {

    jwt.verify(req.headers.authorization, process.env.JWT_KEY, function (erro, decodificado) {

        if (erro) {

            res.status(403).send("Token inválido")
        }
        else {

            next()
        }
    })
}
//cria jwt publico
function criaJWT(userID) {

    return new Promise(function (resolve, reject) {

        jwt.sign({ user_id: userID }, process.env.JWT_KEY, function (erro, token) {

            if (erro) {

                reject(erro.message)
            }
            else {

                resolve(token)
            }
        })
    })
}
//cria jwt do login
function criaJwtLogin(email, senha) {
    return new Promise(function (resolve, reject) {
        jwt.sign({ emailLogado: email, senhaLogado: senha }, process.env.JWT_KEY, function (erro, token) {
            if (erro) {

                reject(erro.message)
            }
            else {

                resolve(token)
            }
        })
    })
}
module.exports = { verificaJWT, criaJWT, criaJwtLogin }