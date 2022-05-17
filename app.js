const express = require('express');
const app = express();
const http = require('http').createServer(app);
const socket = require('socket.io');
const io = socket(http)
const port = 80;

io.on('connection', (socket) => {
    console.log(`커넥션 이벤트 발생\n소켓 아이디: ${socket.id}`)

    socket.on('login', (user) => {
        if (typeof(user) !== 'object') user = JSON.parse(user)
        console.log(`로그인 이벤트 발생\n로그인 타입: ${user.type}\n아이디: ${user.name}\n소켓 아이디: ${socket.id}`)
    })

    socket.on('insert', (data) => {
        if (typeof(data) !== 'object') data = JSON.parse(data)
        console.log('data: ', data)
        console.log(`스테이션 데이터 확인 이벤트 발생\n소켓 아이디: ${socket.id}\n태양광 정보: ${JSON.stringify(data.pv)}`)
        
        data.pcb.sort((a, b) => {
            console.log(a.localeCompare(b))
        })
    })
})

http.listen(port, () => {
    console.log('서버가 연결되었습니다.');
});