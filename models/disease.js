const Sequelize=require("sequelize");

module.exports=class Community extends Sequelize.Model{
	static init(sequelize){
		return super.init({
			disease:{
				type:Sequelize.STRING(140),
				allowNull:false,
			},
		},{
			sequelize,
			timestamps:true,
			underscored:false,
			modelName:"Post",
			tableName:"posts",
			paranoid:false,
			charset:"utf8mb4",
			collate:"utf8mb4_general_ci",
		});
	}
	
	static associate(db){
        db.Community.hasMany(db.Post);
	}
};