var Sequelize = require('sequelize')
var config = require('../../config/database.json')

const sequelize = new Sequelize(config.database, config.username, config.password , {
    host: config.host,
    dialect: 'mysql'
})

const Student = sequelize.define('student', {
    id:{ type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    account: {type: Sequelize.STRING},
    password: {type: Sequelize.STRING},
    name: {type: Sequelize.STRING},
    class: {type: Sequelize.STRING},
    chosen: {type: Sequelize.INTEGER}
})

const Clubs = sequelize.define('club', {
    id:{ type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: {type: Sequelize.STRING},
    max: {type: Sequelize.INTEGER},
    temp: {type: Sequelize.STRING}
})

const Choose = sequelize.define('choose', {
    id:{ type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    stu_id: {type: Sequelize.INTEGER},
    step: {type: Sequelize.INTEGER},
    club_id: {type: Sequelize.INTEGER},
    more: {type: Sequelize.STRING}
})

sequelize.sync()

module.exports = {
    Student: Student,
    Clubs: Clubs,
    Choose: Choose,
    sequelize: sequelize
}
