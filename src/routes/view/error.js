/**
 * 
 * 
 */

const router = require('koa-router')()

// 故意制造一个错误
router.get('/get-an-error', async (ctx, next) => {
    let o = {
        name: 123,
        asd: 'asd',
        ss: 'zxc'
    }
    throw Error()
    ctx.body = {
        msg: 'xxx'
    }
})
// error
router.get('/error', async (ctx, next) => {
    await ctx.render('error')
})
// 404
router.get('*', async (ctx, next) => {
    await ctx.render('404', { url: ctx.url })
})

module.exports = router