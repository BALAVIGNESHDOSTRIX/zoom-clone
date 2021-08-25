const express = require('express')
const app = express()
const server = require('http').Server(app)
const { v4: uuid_v4 } = require('uuid')
const sockIo = require('socket.io')(server)
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
    debug: true
})

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use('/peer', peerServer)


// ROuter

app.get('/', (req, res) => {
    res.redirect(`/${uuid_v4()}`);
})

app.get('/:room', (req,res) => {

    res.render('room', { roomId: req.params.room })
})

sockIo.on('connection', socket => {
    socket.on('join-room', (roomid, userId) => {
        socket.join(roomid)

        // tell new  user is connected
        socket.broadcast.to(roomid).emit('user-connected', userId)

        // message catch
        socket.on('message', message=>{
            sockIo.to(roomid).emit('createMessage', message)
        })
    })  
})

server.listen(3031)