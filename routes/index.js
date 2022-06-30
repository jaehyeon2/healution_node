const { Router } = require('express');
const express = require('express');
const Sequelize = require('sequelize');
// const multer = require('multer');
// const path = require('path')
// const fs = require('fs');

const {isLoggedIn, isNotLoggedIn}=require('./middlewares');

const router=express.Router();

router.use((req, res, next)=>{
    res.locals.user=req.user;
    // res.locals.follwerCount=req.user?req.user.Followers.length:0;
    // res.locals.followingCount=req.user?req.user.Followings.length:0;
    // res.locals.followerIdList=req.user?req.user.Followings.map(f=>f.id):[];
    next();
});



router.get('/', async(req, res, next)=>{
    res.render('startPage', {title:'Main'});
})

//menuBar router
//main router
router.get('/main', async(req, res, next)=>{
    try{
		res.render('main', {title:'Healution'});
	}catch(error){
		console.error(error);
		next(error);
	}
});

//info router
router.get('/info', async(req, res, next)=>{
    res.render('menu/info', {title:'Healution-info'});
});

//community router
router.get('/comm', async(req, res, next)=>{
    res.render('menu/community', {title:'Healution-community'});
});

//wiki router
router.get('/wiki', async(req, res, next)=>{
    res.render('menu/wiki', {title:'Healution-wiki'});
});

//profile router
router.get('/profile/:id', isLoggedIn, async(req, res, next)=>{
    res.render('menu/profile', {title:'Healution-profile'});
});

//user auth router
//join router
router.get('/join', isNotLoggedIn, async(req, res)=>{
    res.render('join', {title:'Healution-join'});
});

//login router
router.get('/login', isNotLoggedIn, async(req, res)=>{
    res.render('login', {title:'Healution-login'});
});

module.exports=router;