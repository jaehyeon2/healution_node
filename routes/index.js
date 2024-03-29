const { Router } = require('express');
const express = require('express');
const Sequelize = require('sequelize');
const multer = require('multer');
const path = require('path')
const fs = require('fs');
const bcrypt = require('bcrypt');

const {Post, User, Hashtag, Wiki, Disease}=require('../models');
//Board, Page, 	
const {isLoggedIn, isNotLoggedIn}=require('./middlewares');

const router=express.Router();

router.use((req, res, next)=>{
    res.locals.user=req.user;
    // res.locals.follwerCount=req.user?req.user.Followers.length:0;
    // res.locals.followingCount=req.user?req.user.Followings.length:0;
    // res.locals.followerIdList=req.user?req.user.Followings.map(f=>f.id):[];
    next();
});



//menuBar router
//main router
router.get('/', async(req, res, next)=>{
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
router.get('/disease', isLoggedIn, async(req, res, next)=>{
	try{
		const diseaseLists = await Disease.findAll();
		res.render('menu/disease/disease', {title:'Healution-community', diseaseLists});
	} catch(error){
		console.error(error);
	}
})

// disease community
router.get('/disease/:name', isLoggedIn, async(req, res, next)=>{
	try {
		console.log('disease', req.params.name);
		// 해당 커뮤니티 이동 로직 짜기
	} catch(error){
		console.error(error);
	}
})

//wiki router
router.get('/wiki', async(req, res, next)=>{
    try{
		const wikiLists = await Wiki.findAll();
		res.render('menu/wiki/wiki', {title:'Healution-wiki', wikiLists});
	} catch(error){
		console.error(error);
	}
});

//wiki info
router.get('/wiki/:id', async(req, res, next)=>{
	try{
		const wikiInfo = await Wiki.findOne({where:{id:req.params.id},});
		res.render('menu/wiki/wiki/detail', {title:`Healution-wiki - ${wikiInfo.name}`, wikiInfo});
	} catch(error){
		console.error(error);
	}
});

//wiki edit
router.get('/wiki/edit/:id', async(req, res, next)=>{
	try{
		const wikiInfo = await Wiki.findOne({where:{id:req.params.id},});
		res.render('/menu/wiki/wiki_edit', {title:`Healution-edit - ${wikiInfo.name}`, wikiInfo});
	} catch(error){
		console.error(error);
	}
});

//
//profile router
router.get('/profile/:id', isLoggedIn, async (req, res, next)=>{
    try{
		console.log('id:', req.params.id);
        const profile=await User.findOne({where:{nick:req.params.id},});
        res.render('menu/profile',{title:'Healution-profile', profile});
        console.log(profile);
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

const upload=multer({
	storage:multer.diskStorage({
		destination(req, file, cb){
			cb(null, 'uploads/');
		},
		filename(req, file, cb){
			const ext=path.extname(file.originalname);
			cb(null, path.basename(file.originalname, ext)+new Date().valueOf()+ext);
		},
	}),
	limits:{fileSize:500*1024*1024},
});

router.post('/post-write-n', isLoggedIn, async(req, res, next)=>{
	try{
		const today = new Date();   
	    const time=today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
		const post=await Post.create({
			title:req.body.title,
			content:req.body.content,
			writer:req.user.nick,
			type:req.body.type,
			boardid:req.body.boardid,
			date:time,
		});
		res.redirect(`/normalboard/${req.body.boardid}`);
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.post('/post-write-p', isLoggedIn, upload.single('image'), async(req, res, next)=>{
	try{
		const today = new Date(); 
	    const time=today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
		const post=await Post.create({
			title:req.body.title,
			image:req.file.filename,
			content:req.body.content,
			writer:req.user.nick,
			type:req.body.type,
			boardid:req.body.boardid,
			date:time,
		});
		res.redirect(`/photoboard/${req.body.boardid}`);
	}catch(error){
		console.error(error);
		next(error);
	}
});

//community board router

module.exports=router;