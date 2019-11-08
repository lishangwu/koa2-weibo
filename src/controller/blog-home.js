const xss = require('xss')
const { createBlog, getFollowersBlogList } = require('../services/blog')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { createBlogFailInfo } = require('../model/ErrorInfo')
const { PAGE_SIZE, REG_FOR_AT_WHO } = require('../conf/constant')
const { getUserInfo } = require('../services/user')
const { createAtRelation } = require('../services/at-relation')

/**
*  // 正则表达式，匹配 '@昵称 - userName'
    REG_FOR_AT_WHO: /@(.+?)\s-\s(\w+?)\b/g
*/
class BlogHomeController{

    //创建微博
    async create({ userId, content, image }){
        // 分析并收集 content 中的 @ 用户
        // content 格式如 '哈喽 @李四 - lisi 你好 @王五 - wangwu '
        const atUserNameList = []
        content = content.replace(REG_FOR_AT_WHO, (matchStr, nickName, userName)=>{
            atUserNameList.push(userName)
            return matchStr
        })

        const atUserList = await Promise.all(
            atUserNameList.map(userName=>getUserInfo(userName))
        )
        const atUserIdList = atUserList.map(user => user.id)

        try {
            const blog = await createBlog({
                userId,
                content: xss(content),
                image
            })
            await Promise.all(atUserIdList.map(
                userId => createAtRelation(blog.id, userId)
            ))

            return new SuccessModel(blog)
        } catch (ex) {
            console.error(ex.message, ex.stack)
            return new ErrorModel(createBlogFailInfo)
        }
    }

    //获取首页微博列表
    async getHomeBlogList(userId, pageIndex = 0){
        const result = await getFollowersBlogList(
            {
                userId,
                pageIndex,
                pageSize: PAGE_SIZE
            }
        )
        const { count, blogList } = result

        return new SuccessModel({
            isEmpty: blogList.length === 0,
            blogList,
            pageSize: PAGE_SIZE,
            pageIndex,
            count
        })
    }
}

module.exports = new BlogHomeController()