const { ErrorModel } = require('../model/ResModel')
const { loginCheckFailInfo } = require('../model/ErrorInfo')

/**
 * API 登录验证
 * @param {*} ctx 
 * @param {*} next 
 */
async function loginCheck(ctx, next){
    if(ctx.session && ctx.session.userInfo){
        await next()
        return
    }
    ctx.body = new ErrorModel(loginCheckFailInfo)
}

async function loginRedirect(ctx, next){
    if(ctx.session && ctx.session.userInfo){
        await next()
        return
    }
    const curUrl = ctx.url
    ctx.redirect('/login?url=' + encodeURIComponent(curUrl))
}

module.exports = {
    loginCheck,
    loginRedirect
}