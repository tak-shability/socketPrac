const express = require('express');
const app = express();
const http = require('http').createServer(app);
const socket = require('socket.io');
const io = socket(http);
const port = 80;

app.use('/', (req, res) => {
    res.sendFile(__dirname + '/test.html');
});

let userList = [];

io.on('connection', (socket) => {
    console.log(`커넥션 이벤트 발생\n소켓 아이디: ${socket.id}`);

    socket.on('login', (user) => {
        if (!user) {
            io.emit('result', {
                code: 'login',
                data: false,
                detail: '존재하지 않는 아이디',
            });
        }
        if (typeof user !== 'object') user = JSON.parse(user);
        // console.log('user 정보', user);
        // console.log(`로그인 이벤트 발생\n로그인 타입: ${user.type}\n아이디: ${user.name}\n소켓 아이디: ${socket.id}`);
        socket.join(user.type);
        userList.push(`connection ${socket.id} = ${user.type}`);
        // console.log('userList', userList);
        io.to('admin').emit('join', {
            userType: user.type,
            message: `${user.name}님이 ${user.type} 방에 입장하셨습니다.`,
        });
        io.emit('result', `타입 : ${user.type}`);
    });

    socket.on('insert', (insertData) => {
        if (!insertData) {
            io.emit('result', {
                code: 'insert',
                data: false,
                detail: '존재하지 않는 정보',
            });
        }
        if (typeof insertData !== 'object') insertData = JSON.parse(insertData);
        // console.log(`스테이션 데이터 확인 이벤트 발생\n소켓 아이디: ${socket.id}\n태양광 정보: ${JSON.stringify(data.pv)}`);
        insertData.pcb.map((v) => Number(v.numb));
        insertData.pcb.sort((a, b) => a.numb - b.numb);
        function insert() {
            let result = '';
            for (let i = 0; i < 3; i++) {
                result += `전력 정보 ${i + 1}번 포트: ${JSON.stringify(insertData.pcb[i])}\n`;
            }
            return result;
        }

        io.to(userList[0].socketID).emit('insertData', insert());

        io.emit('result', {
            code: 'insert',
            data: true,
        });
    });

    socket.on('port_ready', (portData) => {
        if (typeof portData !== 'object') portData = JSON.parse(portData);
        portData.isUsed = true;
        for (let i = 0; i < userList.length; i++) {
            if (userList[i].userName === portData.station_id) {
                io.to(userList[i].socketID).emit('charge_ready', portData);
                break;
            }
        }
    });

    socket.on('kickboard_ready', (kickboardData) => {
        kickboardData.isUsed = true;
        socket.emit('kickboard_ready', kickboardData);
    });
});

http.listen(port, () => {
    console.log('서버가 연결되었습니다.');
});
