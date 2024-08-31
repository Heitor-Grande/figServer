const cryptojs = require("crypto-js")

function criptografar(dado) {
    return new Promise(function (resolve, reject) {
        try {
            const dadoCriptografado = cryptojs.AES.encrypt(dado, process.env.KEY_CRYPTOJS).toString()
            resolve(dadoCriptografado)
        } catch (error) {
            reject(error)
        }
    })
}

function descriptografar(dadoCriptografado) {
    return new Promise(function (resolve, reject) {
        try {
            const dadoDescriptografado = cryptojs.AES.decrypt(dadoCriptografado, process.env.KEY_CRYPTOJS).toString(cryptojs.enc.Utf8)
            resolve(dadoDescriptografado)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {criptografar, descriptografar}