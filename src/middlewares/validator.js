const { ErrorModel } = require('../model/ResModel')
const { jsonSchemaFileInfo } = require('../model/ErrorInfo')

function genValidator(validatefn){
    async function validator(ctx, next){
        const data = ctx.request.body
        const error = validatefn(data)
        if(error){
            ctx.body = new ErrorModel(jsonSchemaFileInfo)
            return
        }
        await next()
    }
    return validator
}

module.exports = {
    genValidator
}