const {
    getAtRelationCount,
    getAtUserBlogList,
    updateAtRelation
} = require('../services/at-relation')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { PAGE_SIZE } = require('../conf/constant')

class BlogAt{

    //获取 @ 我的微博数量
    async getAtMeCount(userId){
        const count = await getAtRelationCount(userId)
        return new SuccessModel({ count })
    }

    // 获取 @ 用户的微博列表
    async getAtMeBlogList({ userId, pageIndex = 0 }){
        const result = await getAtUserBlogList({
            userId, pageIndex, pageSize: PAGE_SIZE
        })
        const { count, blogList } = result

        // 返回
        return new SuccessModel({
            isEmpty: blogList.length === 0,
            blogList,
            pageSize: PAGE_SIZE,
            pageIndex,
            count
        })
    }

    // 标记为已读
    async markAsRead(userId){
        try {
            await updateAtRelation(
                { newIsRead: true },
                { userId, isRead: false }
            )
        } catch (ex) {
            console.error(ex)
        }
    }
}

module.exports = new BlogAt()