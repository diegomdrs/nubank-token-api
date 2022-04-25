module.exports = {
    parseAuthenticateHeaders: headerContent => {
        const chunks = headerContent.split(',')

        return chunks.reduce((map, chunk) => {
            const splited = chunk.split('=')
            let key = splited[0]
            let value = splited[1]

            key = key.trim().replace(' ', '_')
            value = value.replace(/"/g, '')
            map.set(key, value)

            return map
        }, new Map())
    }
}