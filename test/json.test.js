const srever = require('./server')

test('json 返回', async ()=>{
    const res = await srever.get('/json')
    // expect(res.body).toEqual({
    //     title: 'koa2 json'
    // })
    expect(res.body.title).toBe(
        'koa2 json'
    )
})

// test('json 返回2', async ()=>{
//     const res = await srever.post('/login').send({
//         userName: 'zhangsan',
//         password: '123'
//     })
// })