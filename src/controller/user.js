const {
    getUserInfo,
    createUser,
    deleteUser,
    updateUser
} = require('../services/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const {
    registerUserNameNotExistInfo,
    registerUserNameExistInfo,
    registerFailInfo,
    loginFailInfo,
    deleteUserFailInfo,
    changeInfoFailInfo,
    changePasswordFailInfo
} = require('../model/ErrorInfo')
const doCrypto = require('../utils/cryp')

class UserController{

    async isExist(userName){
        const userInfo = await getUserInfo(userName)
        if(userInfo){
            return new SuccessModel(userInfo)
        }else{
            return new ErrorModel(registerUserNameNotExistInfo)
        }
    }

    async register({ userName, password, gender }){
        const userInfo = await getUserInfo(userName)
        if(userInfo){
            return new ErrorModel(registerUserNameExistInfo)
        }

        try {
            await createUser({
                userName,
                password: doCrypto(password),
                gender
            })
            return new SuccessModel()
        } catch (ex) {
            console.error(ex.message, ex.stack)
            return new ErrorModel(registerFailInfo)
        }
    }

    async login(ctx, userName, password){
        const userInfo = await getUserInfo(userName, doCrypto(password))
        if(userInfo){
            return new ErrorModel(loginFailInfo)
        }
        if(ctx.session.userInfo == null){
            ctx.session.userInfo = userInfo
        }
        return new SuccessModel()
    }

    async deleteCurUser(userName){
        const result = await deleteUser(userName)
        if(result){
            return new SuccessModel()
        }
        return new ErrorModel(deleteUserFailInfo)
    }

    async changeInfo(ctx, { nickName, city, picture }){
        const { userName } = ctx.session.userInfo
        if(!nickName){
            nickName = userName
        }

        const ressult = await updateUser(
            {
                newNickName: nickName,
                newCity: city,
                newPicture: picture
            },
            { userName }
        )
        if(result){
            Object.assign(ctx.session.userInfo, {
                nickName,
                city,
                picture
            })
            return new SuccessModel()
        }
        return new ErrorModel(changeInfoFailInfo)
    }

    async changePassword(userName, password, newPassword){
        const result = await updateUser(
            {
                newPassword: doCrypto(newPassword)
            },
            {
                userName,
                password: doCrypto(password)
            }
        )
        if(result){
            return new SuccessModel()
        }
        return new ErrorModel(changePasswordFailInfo)
    }

    async logout(ctx) {
        delete ctx.session.userInfo
        return new SuccessModel()
    }
}

module.exports = new UserController()