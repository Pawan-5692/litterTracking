const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const checkForAuthentication = require('./middleware/authentication.js');
const { restrictTo } = require('./middleware/restrict.js');
const userRoute = require('./routes/userRoute.js');
const collectorRoute = require('./routes/collectorRoute.js')
const adminRoute = require('./routes/adminRoute.js');
const app = express();
const PORT = 3000;
const {User} = require('./models/user.js');
const {collectorModel} = require('./models/collector.js');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); 
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views/.'));
app.use(cookieParser());
app.use(checkForAuthentication('token'));

mongoose.connect('mongodb://localhost:27017/Tracking')
  .then(() => console.log('MongoDb Connected'))
  .catch(e => console.log('MongoDb connection error:', e));

app.get('/',(req, res)=>{
  return res.render('home')
})

app.use('/user', restrictTo(['user','collector','admin']),userRoute);

app.use('/collector', restrictTo(['collector','admin']),collectorRoute);

app.use('/admin',restrictTo(['admin']),adminRoute)

app.get('/some',(req, res)=>{
  return res.json("Dub Mar")
})
app.get('/signin',(req, res)=>{
  res.render('signin')
})
app.post('/signin', async(req, res)=>{
  const {email, password, role} = req.body;

  try{
      if( role == 'user'){
        const token = await User.matchPassword(email,password) 
        return res.cookie("token", token).redirect('/user/home')
      }
      else if(role == 'collector'){
        const token = await collectorModel.matchPassword(email,password)
        return res.cookie("token", token).redirect('/collector/home')
      }
  }
  catch(error){
      return res.status(401).render('signin',{error: 'Invalid email or password'})
  }
})

app.get('/signup',(req, res)=>{
  return res.render('signup')
})

app.post('/signup', async (req, res) => {
  const { fullName, email, password, contact, role } = req.body;

  try {
      if (role === 'user') {
          await User.create({ fullName, email, password, contact, role });
          
          return res.redirect('/user/home')
      } else if (role === 'collector') {
          await collectorModel.create({ fullName, email, password, contact, role });
          
          return res.redirect('/collector/home')
      }
      
  } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).send('Internal Server Error');
  }
});


app.listen(PORT, () => {
    console.log(`Server Started at port ${PORT}`);
});
