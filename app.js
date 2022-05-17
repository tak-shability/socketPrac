const express = require('express');
const app = express();
const http = require('http').createServer(app);
const socket = require('socket.io');
const io = socket(http)
const port = 80;

// app.use('/', (req, res) => {
//     res.send('hello')
// })

io.on('connection', (socket) => {
    console.log('커넥션 이벤트 발생')
    console.log(`소켓 아이디: ${socket.id}`)


io.on('login', (user) => {
        console.log('user', user)
        console.log(`로그인 이벤트 발생, 로그인 타입: ${user.type}, 아이디: ${user.name}, 소켓 아이디: ${socket.id}`)
}) 
})
    // socket.on('insert', (data) => {
    //     if (typeof(data) !== 'object') data = JSON.parse(data)
    //     console.log(data)
    // })

http.listen(port, () => {
    console.log('서버가 연결되었습니다.');
});