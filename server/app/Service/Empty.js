let Model = require('./Model')
let Promise = require('bluebird')
let fs = require('fs')

async function run() {
    let clubs = await Model.Clubs.all()
    let stus = await Model.Student.all()
    let students = []
    for (let i = 0; i < stus.length; i++) {
	let chooses = await Model.sequelize.query('SELECT stu_id,GROUP_CONCAT(DISTINCT club_id ORDER BY step) as chosens FROM `chooses` GROUP BY stu_id HAVING stu_id = ' + stus[i].get('id'), { type: Model.sequelize.QueryTypes.SELECT})
	let temp = {
            name: stus[i].get('name').trim(),
            class: stus[i].get('class').trim(),
            account: stus[i].get('account').trim(),
	    result: '0'
        }
	if (chooses.length==0) {
            students.push(temp)
	} else {
	    console.log(chooses)
	}
    }
    console.log('write data in CSV!')
    let text = ''
    
    for (let i = 0; i < students.length; i++) {
        text += students[i].account + ',' + students[i].class + ',' + students[i].name + '\n'
        text += '\n'
    }
    
    fs.writeFileSync('empty.csv', text)
    console.log('write result finish!')
    return
}

run()
