const { Blog, User, UserRelation } = require('../db/model/index')
const { formatUser, formatBlog } = require('./_format')

class BlogService{
    async createBlog({ userId, content, image }){
        const result = await Blog.create({ userId, content, image })
        return result.dataValues
    }
    async getBlogListByUser({ userName, pageIndex = 0, pageSize = 10 }){
        const userWhereOpts = {}
        if(userName){
            userWhereOpts.userName = userName
        }

        const result = await Blog.findAllCountAll({
            limit: pageSize,
            offset: pageSize * pageIndex,
            order: [['id', 'desc']],
            include: [
                {
                    model: User,
                    attributes: ['userName', 'nickName', 'picture'],
                    where: userWhereOpts
                }
            ]
        })
        // result.count 总数，跟分页无关
        // result.rows 查询结果，数组
        let blogList = result.rows.map(row=>row.dataValues)
        blogList = formatBlog(blogList)
        blogList = blogList.map(blogItem=>{
            const user = blogItem.user.dataValues
            blogItem.user = formatUser(user)
            return blogItem
        })
        return {
            count: result.count,
            blogList
        }
    }

    /**
     * 获取关注着的微博列表（首页）
     * @param {Object} param0 查询条件 { userId, pageIndex = 0, pageSize = 10 }
     */
    async getFollowersBlogList({ userId, pageIndex = 0, pageSize = 10 }){
        const res = await UserRelation.findOne({
            where: { userId }
        })
        const result = await Blog.findAndCountAll({
            limit: pageSize,
            offset: pageSize * pageIndex,
            order: [['id', 'desc']],
            include: [
                {
                    model: User,
                    attributes: ['userName', 'nickName', 'picture'],
                },
                {
                    model: UserRelation,
                    attributes: ['userId', 'followerId'],
                    where: { userId }
                }
            ]
        })
        let blogList = result.rows.map(row=>row.dataValues)
        blogList = formatBlog(blogList)
        blogList = blogList.map(blogItem=>{
            const user = blogItem.user.dataValues
            blogItem.user = formatUser(user)
            return blogItem
        })
        return {
            count: result.count,
            blogList
        }
    }
}

module.exports = new BlogService()