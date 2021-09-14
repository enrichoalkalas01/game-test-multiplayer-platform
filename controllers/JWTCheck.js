const JWT = require('jsonwebtoken')
const SecretKey = 'SecretKey'

const Create = ( Data = null, res = null ) => {
    let TokenData = JWT.sign(Data, SecretKey)
    return TokenData
}

const Check = ( Data = null, res = null ) => {
    let JWTCheckData = JWT.verify(Data, SecretKey, (err, JWTResult) => {
        if (err) return { message: 'jwt error', status: 403 }
        if (JWTResult) return { message: 'success to checking jwt', data: JWTResult, status: 200 }
    })
    
    return JWTCheckData
}

exports.Create = Create
exports.Check = Check