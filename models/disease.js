const Sequelize=require("sequelize");

module.exports=class Disease extends Sequelize.Model{
	static init(sequelize){
		return super.init({
			name:{
				type:Sequelize.STRING(140),
				allowNull:false,
			},
		},{
			sequelize,
			timestamps:true,
			underscored:false,
			modelName:"Disease",
			tableName:"diseases",
			paranoid:false,
			charset:"utf8",
			collate:"utf8_general_ci",
		});
	}
	
	static associate(db){
        db.Disease.hasMany(db.Post);
	}
};