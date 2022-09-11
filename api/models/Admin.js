const db = require('../db');

const Article = require('./Article');

const Admin = db.sequelize.define('admins', {
        id: {
                type: db.Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
        },
        username: {
                type: db.Sequelize.STRING,
                allowNull: false,
		unique: true
        },
        password: {
                type: db.Sequelize.STRING,
                allowNull: false
        }
})

Admin.hasMany(Article);
Article.belongsTo(Admin);

//db.sequelize.sync({force: true})

module.exports = Admin;
