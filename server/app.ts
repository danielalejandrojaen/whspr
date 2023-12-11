import path from 'path'
import express, { Request, Response } from 'express'
import multer from 'multer'
import routes from './routes'
// const db = require('./db')
// const express = require('express')
// const session = require('express-session')
import cors from 'cors'
import http from 'http'
import {Server, Socket} from 'socket.io'
import {ExpressPeerServer} from 'peer'

const clientPath = path.resolve(__dirname, '../client/dist')

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
}
const storage = multer.memoryStorage();
const upload = multer({storage: storage})



const postRoutes = require('./routes/postRoutes')
import { Sound, Post, User } from './dbmodels'

const app = express()
const session = require('express-session');
const crypto = require('crypto');
const passport = require('passport');
require('./auth');
const secret = crypto.randomBytes(64).toString('hex'); //secret hash for session
const cookieParser = require('cookie-parser');
const cookie = require('cookie');

app.use(cors())
app.use(upload.single('audio'))

app.use(cookieParser(secret, {sameSite: 'strict'}))
app.use(session({
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours 
  }
}))
app.use(passport.initialize());
app.use(passport.session());
const server = http.createServer(app)
const io = new Server(server)
// const peerServer = ExpressPeerServer(server, { path: '/peerjs'})

app.use(cors(corsOptions))
app.use(express.json())
// app.use('/peerjs', peerServer)
app.use(express.static(clientPath))




const routeHandler = express.Router()
routeHandler.use('/post', postRoutes)


app.use('/', routeHandler)
app.use('/', routes)

// COOKIE SETUP
const setCookie = cookie.serialize('session', 'whspr');

//AUTHENTICATION ROUTES
app.get('/auth/google', (req: Request, res: Response) => {
  passport.authenticate('google', { scope: ['email', 'profile'] })(req, res);
})

app.get('/google/callback',  passport.authenticate('google', {
  successRedirect: '/protected',
  failureRedirect: '/auth/google/failure',
}),
(req: Request, res: Response) => {
  // set cookies
  res.setHeader('Set-Cookie', setCookie);
  req.session.save()

  res.redirect('/protected')
})


app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

app.use('/logout', (req: Request, res: Response) => {
  req.session.destroy((err: any) => {
    if (err) {
      console.error(err);
    }
  })
  res.redirect('/');
})

//get current user
app.get('/current-user', async (req: Request, res: Response) => {
  console.log('req.session', req);
    try {
      const results = await User.findOne({where: {googleId: req.user}})
      if(results){
        res.status(200).send(results);
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).send('Error fetching user');
    }
})


app.get('/getSoundURLPostId',  async (req, res) =>{
  const {postId} = req.query;
  if(!postId){
    console.error('post Id is undefined or null')
    res.send('post Id is undefined or null').status(400);
    return;
  }
  try{
    const soundRecord = await Sound.findOne({where: {postId}});
    if(!soundRecord){
      console.error('Sound record not found.')
      res.send('Sound record not found.').status(404);
      return
    }
    const soundUrl = soundRecord.get('soundUrl');
    if(soundUrl){
      res.status(200).send({soundUrl});
    }
  }catch(error){
    console.error('Nonspecific error retrieving audio id:', error);
    res.send('Nonspecific error retrieving audio id.').status(500)
  }
  })

app.post('/createPostRecord', async(req, res) =>{
  console.log(req.body);
    try{
      const postRecord = {
      userId: req.body.userId,
      title: req.body.title,
      category: req.body.category,
      soundURL: req.body.soundURL
      }
      await Post.create(postRecord)
      res.status(200).send('Post record created.')
    }catch(error){
      res.status(500).send('Nonspecific error in post create')
    }
  })

  
// io.on('connection', (socket: Socket) => {
//   console.log('Socket connected! ID: ', socket.id)
//   socket.emit('id', socket.id)

//   socket.on('disconnect', () => {
//     console.log('User disconnected')
//     io.emit('disconnected', socket.id)
//   })
  
//   socket.on('call', (data: dataObj) => {
//     console.log('joined')
//     io.to(data.userId).emit('call', {signal: data.signal, from: data.from, name: data.name})
//   })

//   socket.on('answer', (data: dataObj2) => {
//     io.to(data.to).emit('accept', data.signal)
//   })

// })

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('join-channel', (channelName, uid) => {
    socket.join(channelName);
    io.to(channelName).emit('user-joined', uid);
  });

  socket.on('leave-channel', () => {
    const rooms = Object.keys(socket.rooms);
    rooms.forEach((room) => {
      socket.leave(room);
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// MAKE SURE THIS IS LAST
app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.join(clientPath, 'index.html'))
})

export default server
