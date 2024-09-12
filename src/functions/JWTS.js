const jwt = require("jsonwebtoken")
//verifica jwt publico
function verificaJWT(req, res, next) {
    jwt.verify(req.headers.authorization, process.env.JWT_KEY, function (erro, decodificado) {
        if (erro) {
            res.status(403).send({
                message: "Token inválido"
            })
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
function criaJwtLogin(email, senha, idUsuario) {
    return new Promise(function (resolve, reject) {
        jwt.sign({ emailLogado: email, senhaLogado: senha, idUsuario: idUsuario }, process.env.JWT_KEY_LOGIN, { expiresIn: "120h" }, function (erro, token) {
            if (erro) {
                reject(erro.message)
            }
            else {
                resolve(token)
            }
        })
    })
}
//verifica jwt de login
function verificaJWTLogin(req, res, next) {
    //esse token vem com infos do usuario como senha e email
    jwt.verify(req.headers.authorization, process.env.JWT_KEY_LOGIN, function (erro, decodificado) {
        if (erro) {
            res.status(403).send({
                message: "Token inválido"
            })
        }
        else {
            next()
        }
    })
}
//autologin
function autoLogin(req, res) {
    //esse token vem com infos do usuario como senha e email
    jwt.verify(req.headers.authorization, process.env.JWT_KEY_LOGIN, function (erro, decodificado) {
        if (erro) {
            res.status(403).send({
                message: "Token inválido"
            })
        }
        else {
            return res.status(200).send({
                idUsuario: decodificado.idUsuario
            })
        }
    })
}
module.exports = { verificaJWT, criaJWT, criaJwtLogin, verificaJWTLogin, autoLogin }