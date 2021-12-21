import express from 'express'
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose'

const app = express()
const server = createServer(app); 
const socketio = new Server(server);

app.use(express.static(__dirname))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const dbUrl = 'mongodb+srv://Agnes:agyyemi4life@cluster0.d9y2r.mongodb.net/Chat?retryWrites=true&w=majority';

mongoose.connect(dbUrl, {useNewUrlParser:true, useUnifiedTopology:true})

.then((result) => {

  server.listen(8000, () => {
  
    console.log("Listening on port", server.address().port)
  
  })  

})

.catch((err) => {

  console.log(err);
})


const Message = mongoose.model('Message', {
  name:String,
  message:String
})

//var messages = [
 // {name:"Moji", message:"wonderful"},
 // {name:"Tina", message:"amazing stuffs"}
//]

app.get('/messages', (req, res) => {
  
  Message.find()
  .then((messages) => {
    res.send(messages)
  })
  
})

app.post('/messages', (req, res) => {

  const messages = new Message(req.body)
  messages.save((err) => {

    if(err) {
      res.sendStatus(500)
    }

    //messages.push(req.body)
    socketio.emit('messages', req.body)
    console.log(req.body)
    res.sendStatus(200)

  })

 
})

socketio.on('connection', (socket) => {
  console.log("New user connected...")
})
