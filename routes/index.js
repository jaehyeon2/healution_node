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
router.get('/profile/:id', async (req, res, next)=>{
    try{
        
        res.render('menu/profile',{title:'Healution-profile'});
        console.log('fin');
    } catch(error){
        console.error(error);
        next(error);
    }
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

//community board router
router.get('/normalboard/:id', async(req, res, next)=>{
	try{
		const boardinfo=await Board.findOne({where:{id:req.params.id}});
		const posts=await Post.findAll({where:{type:"normal", boardid:req.params.id}});
		res.render('menu/community/normalboard', {title:`일반 게시판 - ${boardinfo.title}`, boardinfo, posts});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/photoboard/:id', async(req, res, next)=>{
	try{
		const boardinfo=await Board.findOne({where:{id:req.params.id}});
		const posts=await Post.findAll({where:{type:"photo", boardid:req.params.id}});
		res.render('menu/community/photoboard', {title:`포토 게시판 - ${boardinfo.title}`, boardinfo, posts});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/post-write', isLoggedIn, async(req, res, next)=>{
	try{
		const board=await Board.findOne({where:{id:req.query.board}});
		res.render('menu/community/post-write', {title:`게시물 작성`, board});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/post/:id', async(req, res, next)=>{
	try{
		const post_tmp=await Post.findOne({
			where:{id:req.params.id},
		});
		await Post.update({
			views:post_tmp.views+1,
		},{
			where:{id:req.params.id},
		});

		const post=await Post.findOne({where:{id:req.params.id}});
		const board=await Board.findOne({where:{id:post.boardid}});
		res.render('menu/community/post', {title:`${post.title}`, post, board});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/deletepost/:id', isLoggedIn, async(req, res, next)=>{
    try{
		const temp=await Post.findOne({where:{id:req.params.id}});
		if (req.user.nick===temp.writer){
			const posts=await Post.destroy({
				where:{id:req.params.id},
			});
			console.log('post delete!');
			res.redirect('/main');
		}
		else{
			res.redirect('/main?authError=권한이 없습니다!')
		}
    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports=router;