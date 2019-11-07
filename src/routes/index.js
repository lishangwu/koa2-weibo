const glob = require('glob')
const { resolve } = require('path')

module.exports = app => {
    glob.sync( resolve(__dirname, './**/*.js') ).forEach(file =>{
        if(file.indexOf('index.js') == -1 && file.indexOf('error.js') == -1 ){
            const route = require(file)
            app.use(route.routes(), route.allowedMethods())
        }
    })
    const errorRouter = require('./view/error')
    app.use(errorRouter.routes(), errorRouter.allowedMethods())
}