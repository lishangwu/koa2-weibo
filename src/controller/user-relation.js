const {
    getUsersByFollower,
    getFollowersByUser,
    addFollower,
    deleteFollower
} = require('../services/user-relation')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { addFollowerFailInfo, deleteFollowerFailInfo } = require('../model/ErrorInfo')

class UserRelationController{
    //根据 userid 获取粉丝列表
    async getFans(userId){
        const { count, userList } = await getFollowersByUser(userId)
        return new SuccessModel({ count, fansList: userList })
    }

    //获取关注人列表
    async getFollowers(userId){
        const { count, userList } = await getUsersByFollower(userId)
        return new SuccessModel({ count, followersList: userList })
    }

    //关注
    async follow(myUserId, curUserId){
        try{
            await addFollower(myUserId, curUserId)
            return new SuccessModel()  
        }catch(ex){
            console.error(ex)
            return new ErrorModel(addFollowerFailInfo)
        }
    }

    //取消关注
    async unFollow(myUserId, curUserId) {
        const result = await deleteFollower(myUserId, curUserId)
        if (result) {
            return new SuccessModel()
        }
        return new ErrorModel(deleteFollowerFailInfo)
    }
}

module.exports = new UserRelationController()