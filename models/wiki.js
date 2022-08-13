const Sequelize=require("sequelize");

module.exports=class Wiki extends Sequelize.Model{
	static init(sequelize){
		return super.init({
			title:{
				type:Sequelize.STRING(15),
				allowNull:false,
				unique:true,
			},
            content:{
                type:Sequelize.STRING(3000),
                allowNull:false,
            }
		},{
			sequelize,
			timestamps:true,
			undersored:false,
			modelName:"Wiki",
			tableName:"wikis",
			paranoid:false,
			charset:"utf8",
			collate:"utf8_general_ci",
		});
	}
	
};