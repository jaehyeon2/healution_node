const Sequelize=require('sequelize');
const env=process.NODE_ENV||'development';
const config=require("../config/config")[env];

const User=require("./user");
const Post=require('./post');
const Board=require('./board');

const db={};
const sequelize=new Sequelize(
    config.database, config.username, config.password, config,
    );

db.sequelize=sequelize;
db.User=User;
db.Board=Board;
db.Post=Post;

User.init(sequelize);
Board.init(sequelize);
Post.init(sequelize);

// User.associate(db);
// Page.associate(db);
// Board.associate(db);
// Post.associate(db);

module.exports=db;