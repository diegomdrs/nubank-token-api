const { v4: uuidv4 } = require('uuid')
const { generateKeyPair, convertPrivateKeyPEMToBase64, convertPrivateKeyBase64ToPEM, extractPublicKeyPEMFromPrivateKeyPEM, convertCertificatePEMtoBase64, convertCertificateBase64toPEM } = require('../util/crypto-util')
const { parseAuthenticateHeaders } = require('../util/util')
const { X509Certificate } = require('crypto')
const logger = require('../config/logger')
const { StatusCodes } = require('http-status-codes')
const { discovery, requestCode, exchangeKey, getRefreshToken, query, bills } = require('../gateway')

module.exports = {
    requestCode: async (request) => {
        const deviceId = uuidv4()

        const { publicKey: publicKeyPEM, privateKey: privateKeyPEM } = generateKeyPair()
        const { publicKey: publicKeyCryptoPEM, privateKey: privateKeyCryptoPEM } = generateKeyPair()

        // TODO - Criar classe disso aqui
        const payload = {
            'login': request.login,
            'password': request.password,
            'public_key': publicKeyPEM,
            'public_key_crypto': publicKeyCryptoPEM,
            'model': `${request.deviceName} (${deviceId})`,
            'device_id': deviceId
        }

        const { status: discoveryStatus, json: discoveryJson } = await discovery()
        logger.info(`discovery status: ${discoveryStatus}`)
        logger.debug(`discovery json: ${discoveryJson}`)

        const genCertificateUrl = discoveryJson.gen_certificate
        const tokenUrl = discoveryJson.token

        return requestCode(genCertificateUrl, payload).then(({ headers, status, json }) => {
            logger.info(`status: ${status}`)
            logger.debug(`json: ${JSON.stringify(json)}`)

            if (status != StatusCodes.UNAUTHORIZED)
                throw new Error(`Status code: ${status}`)

            const authCode = headers.get('WWW-Authenticate')
            logger.debug(`authCode: ${authCode}`)

            if (!authCode)
                throw new Error('Authentication code request failed.')

            const parsed = parseAuthenticateHeaders(authCode)

            const sentTo = parsed.get('sent-to')
            logger.info(`sentTo: ${sentTo}`)

            const encryptedCode = parsed.get('device-authorization_encrypted-code')
            logger.debug(`encryptedCode: ${encryptedCode}`)

            const privateKeyBase64 = convertPrivateKeyPEMToBase64(privateKeyPEM)
            const privateKeyCryptoBase64 = convertPrivateKeyPEMToBase64(privateKeyCryptoPEM)

            return {
                sentTo,
                encryptedCode,
                genCertificateUrl,
                tokenUrl,
                deviceId,
                privateKeyBase64,
                privateKeyCryptoBase64
            }
        }).catch(err => {
            logger.error(err)
            throw err
        })
    },

    exchangeKey: async (request) => {
        const privateKeyPEM = convertPrivateKeyBase64ToPEM(request.privateKey)
        const privateKeyCryptoPEM = convertPrivateKeyBase64ToPEM(request.privateKeyCrypto)

        const publicKeyPEM = extractPublicKeyPEMFromPrivateKeyPEM(privateKeyPEM)
        const publicKeyCryptoPEM = extractPublicKeyPEMFromPrivateKeyPEM(privateKeyCryptoPEM)

        // TODO - Criar classe disso aqui
        const payload = {
            'login': request.login,
            'password': request.password,
            'public_key': publicKeyPEM,
            'public_key_crypto': publicKeyCryptoPEM,
            'model': `${request.deviceName} (${request.deviceId})`,
            'device_id': request.deviceId,
            'code': request.codeSentByEmail,
            'encrypted-code': request.encryptedCode
        }

        return exchangeKey(request.genCertificateUrl, payload).then(({ status, json }) => {
            logger.info(`status: ${status}`)
            logger.debug(`json: ${JSON.stringify(json)}`)

            if (status != StatusCodes.OK)
                throw new Error(`Status code: ${status}`)

            const certificate = new X509Certificate(json.certificate)
            const certificateBase64 = convertCertificatePEMtoBase64(json.certificate)

            logger.debug(`validFrom: ${certificate.validFrom}`)
            logger.debug(`validTo: ${certificate.validTo}`)

            return {
                certificateBase64,
                validFrom: new Date(certificate.validFrom),
                validTo: new Date(certificate.validTo)
            }
        }).catch(err => {
            logger.error(err)
            throw err
        })
    },

    getRefreshToken: async (request) => {
        const privateKeyPEM = convertPrivateKeyBase64ToPEM(request.privateKey)
        const certificatePEM = convertCertificateBase64toPEM(request.certificate)

        const payload = {
            'grant_type': 'password',
            'client_id': 'legacy_client_id',
            'client_secret': 'legacy_client_secret',
            'login': request.login,
            'password': request.password
        }

        const cert = {
            cert: certificatePEM,
            key: privateKeyPEM,
            passphrase: '',
        }

        return getRefreshToken(request.tokenUrl, cert, payload).then(({ status, json }) => {
            logger.info(`status: ${status}`)
            logger.debug(`json: ${JSON.stringify(json)}`)

            if (status != 200)
                throw new Error(`Status code: ${status}`)

            const refreshToken = json.access_token
            logger.debug(`refreshToken: ${refreshToken}`)

            const refreshBefore = json.refresh_before
            logger.debug(`refreshBefore: ${refreshBefore}`)

            const links = json._links
            logger.debug(`links: ${refreshBefore}`)

            return { refreshToken, refreshBefore, links }
        }).catch(err => {
            logger.error(err)
            throw err
        })
    },

    query: async (request) => {
        const privateKeyPEM = convertPrivateKeyBase64ToPEM(request.privateKey)
        const certificatePEM = convertCertificateBase64toPEM(request.certificate)

        const cert = {
            cert: certificatePEM,
            key: privateKeyPEM,
            passphrase: '',
        }

        // TODO - Melhorar recebimento da query GraphQL
        const graphQL = {
            query: request.query
        }

        return query(request.queryUrl, request.refreshToken, cert, graphQL).then(({ status, json }) => {
            logger.info(`status: ${status}`)
            logger.debug(`json: ${JSON.stringify(json)}`)

            if (status != 200)
                throw new Error(`Status code: ${status}`)

            return json.data
        }).catch(err => {
            logger.error(err)
            throw err
        })
    },

    bills: async (request) => {
        const privateKeyPEM = convertPrivateKeyBase64ToPEM(request.privateKey)
        const certificatePEM = convertCertificateBase64toPEM(request.certificate)

        const cert = {
            cert: certificatePEM,
            key: privateKeyPEM,
            passphrase: '',
        }

        return bills(request.billsUrl, request.refreshToken, cert).then(({ status, json }) => {
            logger.info(`status: ${status}`)
            logger.debug(`json: ${JSON.stringify(json)}`)

            if (status != 200)
                throw new Error(`Status code: ${status}`)

            return json
        }).catch(err => {
            logger.error(err)
            throw err
        })
    }
}