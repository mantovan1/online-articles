const db = require('../db')

const Article = db.sequelize.define('articles', {
        id: {
                type: db.Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
        },
        title: {
                type: db.Sequelize.STRING,
                allowNull: false
        },
	folder_path: {
                type: db.Sequelize.STRING,
                allowNull: false,
		unique: true
        }
})



//db.sequelize.sync({force: true})

module.exports = Article;

