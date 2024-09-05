const dbconnection = require("../../database/dbconnection");
const { verificaJWT } = require("../../functions/JWTS");
const recSenha = require("express").Router()
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken");
const { criptografar } = require("../../functions/crypto");
//função criada para retornar pagina html a ser enviada no e-mail
function GerarPaginaHtml(codigo) {
    const paginaHtmlEmail = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperação de Senha</title>
            <style>
                body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                }
                .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header {
                text-align: center;
                padding: 10px 0;
                background-color: #4CAF50;
                color: #fff;
                border-radius: 8px 8px 0 0;
                }
                .header h1 {
                margin: 0;
                font-size: 24px;
                }
                .content {
                margin: 20px 0;
                text-align: center;
                }
                .content p {
                font-size: 16px;
                color: #333;
                }
                .code {
                font-size: 24px;
                font-weight: bold;
                color: #4CAF50;
                letter-spacing: 2px;
                margin: 20px 0;
                }
                .footer {
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #888;
                }
            </style>
            </head>
            <body>
            <div class="container">
                <div class="header">
                <h1>Recuperação de Senha</h1>
                </div>
                <div class="content">
                <p>Olá,</p>
                <p>Você solicitou a recuperação de sua senha. Por favor, utilize o código abaixo para continuar o processo:</p>
                <div class="code">${codigo}</div>
                <p>Se você não solicitou esta recuperação, por favor ignore este e-mail.</p>
                </div>
                <div class="footer">
                <p>© 2024 GRANDE SOLUÇÕES DIGITAIS. Todos os direitos reservados.</p>
                </div>
            </div>
            </body>
            </html>
    `
    return paginaHtmlEmail
}
//função criada para gerar o token que vai guardar o codigo gerado
function gerarTokenRecSenha(codigo) {
    return new Promise(function (resolve, reject) {
        jwt.sign({ codigo: codigo }, process.env.JWT_KEY, { expiresIn: "2h" }, function (erro, token) {
            if (erro) {
                reject(erro)
            }
            else {
                resolve(token)
            }
        })
    })
}
//função criada para verificar o token
function verificaTokenRecSenha(req, res, next) {
    const token = req.body.token
    const codigo = req.body.codigo
    jwt.verify(token, process.env.JWT_KEY, function (erro, decodificado) {
        if (erro) {
            return res.status(403).send({
                message: "Token vencido, gere outro código."
            })
        }
        else if (decodificado.codigo == codigo) {
            next()
        }
        else if (decodificado.codigo != codigo) {
            return res.status(403).send({
                message: "Código inválido."
            })
        }
    })
}
//rota usada para recuperação de senha na tela de login
recSenha.post("/enviar/email/recuperacao/senha", verificaJWT, async function (req, res) {
    try {
        const email = req.body.email
        //verifica se e-mail está cadastrado
        const SqlSelectUsuario = `
            select email from public.usuario
            WHERE
            email = '${email}'
        `
        if ((await dbconnection.query(SqlSelectUsuario)).rows.length == 1) {
            //gerando codigo e token
            const codigo = parseInt(Math.random() * 100000)
            const token = await gerarTokenRecSenha(codigo)
            //enviando e-mail
            const transporter = nodemailer.createTransport({
                host: process.env.HOST_SMTP,
                port: parseInt(process.env.PORT_SMTP),
                secure: false,
                auth: {
                    user: process.env.USER_SMTP,
                    pass: process.env.PASS_SMTP
                }
            })
            await transporter.sendMail({
                from: process.env.USER_SMTP,
                to: email,
                subject: "Recuperação de senha FIG.",
                html: GerarPaginaHtml(codigo)
            })
            //resposta de sucesso
            return res.status(200).send({
                message: "E-mail de recuperação enviado.",
                token: token
            })
        }
        else {
            return res.status(400).send({
                message: "E-mail não encontrado."
            })
        }

    } catch (error) {
        return res.status(500).send({
            message: "Erro ao enviar e-mail: " + error.message || error
        })
    }
})
//rota responsavel por validar código de recuperação
recSenha.post("/validar/codigo/recuperacao", verificaJWT, verificaTokenRecSenha, function (req, res) {
    return res.status(200).send({
        message: "Código válido."
    })
})
//atualiza a senha do usuario
recSenha.put("/recupera/senha/usuario", verificaJWT, async function (req, res) {
    try {
        const { email, novaSenha } = req.body
        const SqlUpdateSenha = `
        UPDATE public.usuario
        SET
        senha = '${await criptografar(novaSenha)}'
        where email = '${email}'
        `
        await dbconnection.query(SqlUpdateSenha)
        return res.status(200).send({
            message: "Sucesso ao atualizar senha."
        })
    } catch (error) {
        return res.status(500).send({
            message: "Erro ao recuperar senha: " + error.message
        })
    }
})
module.exports = recSenha