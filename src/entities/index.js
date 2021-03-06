
class RequestCodeDTO {
    constructor(body) {
        this.login = body.login
        this.password = body.password
        this.genCertificateUrl = body.genCertificateUrl
        this.deviceName = body.deviceName
    }
}

class ResponseRequestCodeDTO {
    constructor({ sentTo, encryptedCode, deviceId, privateKeyBase64, privateKeyCryptoBase64 }) {
        this.sentTo = sentTo
        this.encryptedCode = encryptedCode
        this.deviceId = deviceId
        this.privateKey = privateKeyBase64
        this.privateKeyCrypto = privateKeyCryptoBase64
    }
}

class RequestExchangeKeyDTO {
    constructor(body) {
        this.login = body.login
        this.password = body.password
        this.genCertificateUrl = body.genCertificateUrl
        this.deviceName = body.deviceName

        this.deviceId = body.deviceId
        this.codeSentByEmail = body.codeSentByEmail
        this.encryptedCode = body.encryptedCode
        this.privateKey = body.privateKey
        this.privateKeyCrypto = body.privateKeyCrypto
    }
}

class ResponseExchangeKeyDTO {
    constructor({ certificateBase64, validFrom, validTo }) {
        this.certificate = certificateBase64
        this.certificateValidFrom = validFrom,
        this.certificateValidTo = validTo
    }
}

class RequestGetRefreshTokenDTO {
    constructor(body) {
        this.login = body.login
        this.password = body.password
        this.tokenUrl = body.tokenUrl
        this.privateKey = body.privateKey
        this.certificate = body.certificate
    }
}

class ResponseGetRefreshTokenDTO {
    constructor({ refreshToken, refreshBefore }) {
        this.refreshToken = refreshToken
        this.refreshBefore = refreshBefore
    }
}

module.exports = {
    RequestCodeDTO, ResponseRequestCodeDTO,
    RequestExchangeKeyDTO, ResponseExchangeKeyDTO,
    RequestGetRefreshTokenDTO, ResponseGetRefreshTokenDTO
}