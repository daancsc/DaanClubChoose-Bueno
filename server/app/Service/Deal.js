let Model = require('./Model')
let Promise = require('bluebird')
let _ = require('lodash')
let fs = require('fs')

let clubs = await Model.Clubs.all()

let chooses = await Model.sequelize.query('SELECT stu_id,GROUP_CONCAT(DISTINCT club_id ORDER BY step) as chosens FROM `chooses` GROUP BY stu_id', { type: sequelize.QueryTypes.SELECT})

let students = []
let other = []
let com = []
// let finish = []

for (let i = 0; i < chooses.length; i++) {
    let stu = await Model.Student.findById(chooses[i].get('stu_id'))
    let temp = {
        name: stu.get('name'),
        class: stu.get('class'),
        account: stu.get('account'),
        chooses: chooses[i].get('chosens').split(','),
        result: null
    }
    if (stu.get('class').search('綜高') !== -1) {
        com.push(temp)
    } else {
        other.push(temp)
    }
    students.push(temp)
}

let clubList = []
for (let i = 0; i < clubs.length; i++) {
    let club = {
        id: clubs[i].get('id'),
        name: clubs[i].get('name'),
        max: clubs[i].get('max'),
        students: []
    }
    clubList.push(club)
}

com = _.shuffle(com)
other = _.shuffle(other)

for (let k = 0; k < 15; k++) {
    for (let i = 0; i < com.length; i++) {
        for (let j = 0; j < clubList.length; j++) {
            if (clubList[j].id === parseInt(com[i].chooses[k])) {
                if (clubList[j].students.length < 3) {
                    com[i].result = clubList[j].name
                    clubList[j].students.push(com[i])
                }
            }
        }
    }
}

for (let k = 0; k < 15; k++) {
    for (let i = 0; i < other.length; i++) {
        for (let j = 0; j < clubList.length; j++) {
            if (clubList[j].id === parseInt(other[i].chooses[k])) {
                if ((clubList[j].max - clubList[j].students.length) > 0) {
                    other[i].result = clubList[j].name
                    clubList[j].students.push(other[i])
                }
            }
        }
    }
}


let text = ''

for (let i = 0; i < students.length; i++) {
    text += students[i].account + ',' + students[i].class + ',' + students[i].name + ',' + students[i].result + '\n'
}

fs.writeFileSync('result.csv', text)

