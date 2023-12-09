
import path from 'path'
import express, { Request, Response } from 'express'
import multer from 'multer'
import routes from './routes'
import cors from 'cors'
const clientPath = path.resolve(__dirname, '../client/dist')
const storage = multer.memoryStorage();
const upload = multer({storage: storage})
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
app.use(express.json())
app.use(express.static(clientPath))

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
  console.log('req.session', req.session);

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
    const audioId = soundRecord.get('soundURL');
    if(audioId){
      res.status(200).send({audioId});
    }
  }catch(error){
    console.error('Nonspecific error retrieving audio id:', error);
    res.send('Nonspecific error retrieving audio id.').status(500)
  }
  })

app.post('/createPostRecord', async(req, res) =>{
    try{
      const postRecord = {
      userId: req.body.userId,
      title: req.body.title,
      category: req.body.category,
      audioId: 1
    }
      await Post.create(postRecord)
      res.status(200).send('Post record created.')
    }catch(error){
      res.status(500).send('Nonspecific error in post create')
    }
  })

// MAKE SURE THIS IS LAST
app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.join(clientPath, 'index.html'))
})

export default app
