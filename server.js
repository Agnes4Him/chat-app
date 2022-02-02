import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

const app = express();
const port = process.env.PORT || 8000; 
const server = createServer(app);  // or import http from 'http', then http.creatServer(app)
const socketio = new Server(server);
dotenv.config()

app.use(express.static(__dirname, 'src'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const dbUrl = process.env.CONNECTION_KEY

mongoose.connect(dbUrl, {useNewUrlParser:true, useUnifiedTopology:true})

.then((result) => {

  server.listen(port, () => {
  
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
