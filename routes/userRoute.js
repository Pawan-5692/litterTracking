const express = require('express');
const {User} = require('../models/user.js');
const {complainModel} = require('../models/complain.js');
const router = express.Router();
const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/home',(req, res)=>{
    return res.render('userHome',{
        user: req.user,
    })
})

router.get('/logout',(req, res)=>{
    res.clearCookie('token').redirect('/')
})

router.post('/upload', upload.single('image'), async (req, res) => {
    const { complain,location } = req.body;
    const locationArray = JSON.parse(location);
    try {
        await complainModel.create({
            imageURL: `/uploads/${req.file.filename}`,
            complain: complain[1],
            createdBy: req.user._id,
            location: locationArray,
            date: Date.now(),
        });
        res.json({ message: 'File uploaded successfully', file: req.file });
    } catch (error) {
        console.log('Complain creation error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/capture',(req, res)=>{
    return res.render('capture',{user: req.user})
})

router.get('/profile',async(req, res)=>{
    const user = await User.findById(req.user.id);
    console.log(user)
    return res.render('profile',{user: user})
})

module.exports = router;
