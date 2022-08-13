const Sequelize=require('sequelize');
const env=process.NODE_ENV||'development';
const config=require("../config/config")[env];

const User=require("./user");
const Post=require('./post');
const Disease=require('./disease');
const Hashtag=require('./hashtag');
const Wiki=require('./wiki');

const db={};
const sequelize=new Sequelize(
    config.database, config.username, config.password, config,
    );

db.sequelize=sequelize;
db.User=User;
db.Post=Post;
db.Disease=Disease;
db.Hashtag=Hashtag;
db.Wiki=Wiki;

User.init(sequelize);
Post.init(sequelize);
Disease.init(sequelize);
Hashtag.init(sequelize);
Wiki.init(sequelize);

// User.associate(db);
Post.associate(db);
Disease.associate(db);
Hashtag.associate(db);
// Wiki.associate(db);
// Page.associate(db);

module.exports=db;