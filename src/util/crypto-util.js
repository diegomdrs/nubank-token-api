const { generateKeyPairSync, createPrivateKey, createPublicKey, X509Certificate } = require('crypto')

const PRIVATE_KEY_ENCODING_TYPE = 'pkcs8'
const PUBLIC_KEY_ENCODING_TYPE = 'spki'

module.exports = {
    extractPublicKeyPEMFromPrivateKeyPEM: privateKeyPEM => {
        return createPublicKey({
            key: privateKeyPEM,
            format: 'pem'
        }).export({
            format: 'pem',
            type: PUBLIC_KEY_ENCODING_TYPE
        })
    },

    convertCertificatePEMtoBase64: (certificatePEM) => {
        const x509 = new X509Certificate(certificatePEM)
        const certificateBase64 = convertDERtoBase64(x509.raw)
        return certificateBase64
    },

    convertPrivateKeyBase64ToPEM: privateKeyBase64 => {
        const privateKeyDER = Buffer.from(privateKeyBase64, 'base64')
        const privateKeyPEM = convertPrivateKeyDERtoPEM(privateKeyDER)
        return privateKeyPEM
    },

    convertPrivateKeyPEMToBase64: privateKeyPEM => {
        const privateKeyDER = createPrivateKey({
            key: privateKeyPEM,
            format: 'pem',
            type: PRIVATE_KEY_ENCODING_TYPE
        }).export({ format: 'der', type: PRIVATE_KEY_ENCODING_TYPE })
        return convertDERtoBase64(privateKeyDER)
    },

    convertCertificateBase64toPEM: certificateBase64 => {
        const certificateDER = Buffer.from(certificateBase64, 'base64');
        const certificatePEM = new X509Certificate(certificateDER).toString()
        return certificatePEM
    },

    generateKeyPair: () => {
        return generateKeyPairSync('rsa', {
            modulusLength: 2048,
            privateKeyEncoding: {
                type: PRIVATE_KEY_ENCODING_TYPE,
                format: 'pem'
            },
            publicKeyEncoding: {
                type: PUBLIC_KEY_ENCODING_TYPE,
                format: 'pem'
            }
        })
    }
}

function convertPrivateKeyDERtoPEM(keyDER) {
    return createPrivateKey({
        key: keyDER,
        format: 'der',
        type: PRIVATE_KEY_ENCODING_TYPE
    }).export({ format: 'pem', type: PRIVATE_KEY_ENCODING_TYPE })
}

function convertDERtoBase64(der) {
    return Buffer.from(der).toString('base64')
}
