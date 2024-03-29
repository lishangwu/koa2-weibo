const { User, UserRelation } = require('../db/model/index')
const { formatUser } = require('./_format')
const Sequelize = require('sequelize')

class UserRelationService{
    /**
     * 关注我的
     * @param {number} followerId 
     */
    async getUsersByFollower(followerId){
        const result = await User.findAndCountAll({
            attributes: ['id', 'userName', 'nickName', 'picture'],
            order: [['id', 'desc']],
            include: [
                {
                    model: UserRelation,
                    where: {
                        followerId,
                        userId: { [Sequelize.Op.ne]: followerId }
                    }
                }
            ]
        })
        let userList = result.rows.map(row=>row.dataValues)
        userList = formatUser(userList)
        return{
            count: result.count,
            userList
        }
    }

    //我关注的
    async getFollowersByUser(userId){
        const result = await UserRelation.findAndCountAll({
            order: [['id', 'desc']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'userName', 'nickName', 'picture']
                }
            ],
            where: {
                userId,
                followerId: {
                    [Sequelize.Op.ne]: userId // 默认会有关注自己
                }
            }
        })
        let userList = result.rows.map(row=>row.dataValues)
        userList = userList.map(item=>{
            let user = item.user
            user = user.dataValues
            user = formatUser(user)
            return user
        })
        return{
            count: result.count,
            userList
        }
    }
    
    async addFollower(userId, followerId){
        const result = await UserRelation.create({
            userId,
            followerId
        })
        return result.dataValues
    }
    async deleteFollower(userId, followerId) {
        const result = await UserRelation.destroy({
            where: {
                userId,
                followerId
            }
        })
        return result > 0
    }
}

module.exports = new UserRelationService()