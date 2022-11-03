
const packageInfo = require('../../package.json')

module.exports = {
    info: {
        version: packageInfo.version,
        title: packageInfo.name,
        description: packageInfo.description
    },
    host: "localhost:8080",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Token"
        }
    ],
    '@definitions': {
        RequestCodeDTO: {
            type: 'object',
            properties: {
                login: {
                    type: 'string',
                    description: 'O CPF com conta no Nubank',
                    example: 'SEU CPF'
                },
                password: {
                    type: 'string',
                    description: 'Senha Web do Nubank',
                    example: 'SENHA WEB DO NUBANK'
                },
                deviceName: {
                    type: 'string',
                    description: 'Apelido do dispositivo a ser autorizado a obter o token',
                    example: 'MY DEVICE'
                }
            },
            required: ['login','password','deviceName','genCertificateUrl']
        },
        ResponseRequestCodeDTO: {
            type: 'object',
            properties: {
                sentTo: {
                    type: 'string',
                    description: 'Email que receberá o código de segurança',
                    example: 'f**********o@email.com'
                },
                encryptedCode: {
                    type: 'string',
                    description: 'Código encriptado do dispositivo autorizado',
                    example: '[...]'
                },
                genCertificateUrl: {
                    type: 'string',
                    description: 'URL para obtenção do código',
                    example: 'https://prod-global-webapp-proxy.nubank.com.br/api/proxy/AJxL5LApUVAX0b5R5DnjMw3-9ibnk8UnZg.aHR0cHM6Ly9wcm9kLWdsb2JhbC1hdXRoLm51YmFuay5jb20uYnIvYXBpL2dlbi1jZXJ0aWZpY2F0ZXM'
                },
                deviceId: {
                    type: 'string',
                    description: 'Identificação (uuidv4) do dispositivo',
                    example: 'cf38650a-b7f3-4dba-bc2f-3d1014a80378'
                },
                privateKey: {
                    type: 'string',
                    description: 'Base64 da chave privada gerada',
                    example: '[...]'
                },
                privateKeyCrypto: {
                    type: 'string',
                    description: 'Base64 da chave privada gerada',
                    example: '[...]'
                }
            },
            required: ['sentTo','encryptedCode','deviceId','privateKey','privateKeyCrypto']
        },
        RequestExchangeKeyDTO: {
            type: 'object',
            properties: {
                login: {
                    type: 'string',
                    description: 'O CPF com conta no Nubank',
                    example: 'SEU CPF'
                },
                password: {
                    type: 'string',
                    description: 'Senha Web do Nubank',
                    example: 'SENHA WEB DO NUBANK'
                },
                deviceName: {
                    type: 'string',
                    description: 'Apelido do dispositivo a ser autorizado a obter o token de acesso',
                    example: 'MY DEVICE'
                },
                genCertificateUrl: {
                    type: 'string',
                    description: 'URL para obtenção do código',
                    example: 'https://prod-global-webapp-proxy.nubank.com.br/api/proxy/AJxL5LApUVAX0b5R5DnjMw3-9ibnk8UnZg.aHR0cHM6Ly9wcm9kLWdsb2JhbC1hdXRoLm51YmFuay5jb20uYnIvYXBpL2dlbi1jZXJ0aWZpY2F0ZXM'
                },
                codeSentByEmail: {
                    type: 'string',
                    description: 'Código de segurança enviado por email',
                    example: 'yib5e6'
                },
                encryptedCode: {
                    type: 'string',
                    description: 'Código encriptado do dispositivo autorizado',
                    example: '[...]'
                },
                deviceId: {
                    type: 'string',
                    description: 'Identificação (uuidv4) do dispositivo',
                    example: 'cf38650a-b7f3-4dba-bc2f-3d1014a80378'
                },
                privateKey: {
                    type: 'string',
                    description: 'Base64 da chave privada gerada',
                    example: '[...]'
                },
                privateKeyCrypto: {
                    type: 'string',
                    description: 'Base64 da chave privada gerada',
                    example: '[...]'
                }
            },
            required: ['login','password','deviceName','genCertificateUrl','codeSentByEmail','encryptedCode','deviceId','privateKey','privateKeyCrypto']
        },
        ResponseExchangeKeyDTO: {
            type: 'object',
            properties: {
                certificate: {
                    type: 'string',
                    description: 'Base64  do certificado do dispositivo autorizado a obter o token de acesso',
                    example: '[...]'
                },
                certificateValidFrom: {
                    type: 'string',
                    description: 'Data de início da validade do certificado',
                    example: '2022-04-22T14:05:27.000Z'
                },
                certificateValidTo: {
                    type: 'string',
                    description: 'Data final da validade do certificado',
                    example: '2022-10-19T14:05:27.000Z'
                },
            }
        },
        RequestGetRefreshTokenDTO: {
            type: 'object',
            properties: {
                login: {
                    type: 'string',
                    description: 'O CPF com conta no Nubank',
                    example: 'SEU CPF'
                },
                password: {
                    type: 'string',
                    description: 'Senha Web do Nubank',
                    example: 'SENHA WEB DO NUBANK'
                },
                tokenUrl: {
                    type: 'string',
                    description: 'URL de obtenção do token',
                    example: 'https://prod-global-auth.nubank.com.br/api/token'
                },
                privateKey: {
                    type: 'string',
                    description: 'Base64 da chave privada gerada',
                    example: '[...]'
                },
                certificate: {
                    type: 'string',
                    description: 'Base64  do certificado do dispositivo autorizado a obter o token de acesso',
                    example: '[...]'
                },               
            },
            required: ['login','password','tokenUrl','privateKey','certificate']
        },
        ResponseGetRefreshTokenDTO: {
            type: 'object',
            properties: {
                refreshToken: {
                    type: 'string',
                    description: 'O token (JWT) de segurança',
                    example: '[...]'
                },
                refreshBefore: {
                    type: 'string',
                    description: 'Data final da validade do token',
                    example: '2022-10-19T14:05:27.000Z'
                },
            }
        },
    }
}