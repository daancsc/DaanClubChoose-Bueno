let Model = require('./Model')
let Promise = require('bluebird')
let _ = require('lodash')
let fs = require('fs')

async function run() {
    let clubs = await Model.Clubs.all()
    
    let stus = await Model.Student.all()
    
    let students = []
    let other = []
    let com = []
    // let finish = []

    // console.log(chooses)
    
    for (let i = 0; i < stus.length; i++) {
        if (stus[i].get('chosen') === 1) continue
        let chooses = await Model.sequelize.query('SELECT stu_id,GROUP_CONCAT(DISTINCT club_id ORDER BY step) as chosens FROM `chooses` GROUP BY stu_id HAVING stu_id = ' + stus[i].get('id'), { type: Model.sequelize.QueryTypes.SELECT})
        let temp = {
            name: stus[i].get('name').trim(),
            class: stus[i].get('class').trim(),
            account: stus[i].get('account').trim(),
            result: null
        }
        // console.log(chooses)
        if (chooses.length > 0) {
            temp.chooses = chooses[0]['chosens'].split(',')
        } else {
            temp.chooses = []
        }
        if (stus[i].get('class').search('綜高') !== -1) {
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
    // console.log('com:' + com.length)
    // console.log('other:' + other.length)

    console.log('struct finish!')
    
    com = _.shuffle(com)
    other = _.shuffle(other)

    console.log('random')
    
    for (let k = 0; k < 15; k++) {
        for (let i = 0; i < com.length; i++) {
            for (let j = 0; j < clubList.length; j++) {
                if (com[i].result === null) {
                    if (clubList[j].id == parseInt(com[i].chooses[k])) {
                        if (clubList[j].students.length <= 6) {
                            com[i].result = clubList[j].name
                            clubList[j].students.push(com[i])
                        }
                    }
                }
            }
        }
    }
    
    for (let k = 0; k < 15; k++) {
        for (let i = 0; i < other.length; i++) {
            for (let j = 0; j < clubList.length; j++) {
                if (other[i].result === null) {
                    if (clubList[j].id == parseInt(other[i].chooses[k])) {
                        console.log((clubList[j].max - clubList[j].students.length))
                        if ((clubList[j].max - clubList[j].students.length) > 0) {
                            other[i].result = clubList[j].name
                            clubList[j].students.push(other[i])
                        }
                    }
                }
            }
        }
    }

    console.log('deal finish!')
    
    
    let text = ''
    
    for (let i = 0; i < students.length; i++) {
        text += students[i].account + ',' + students[i].class + ',' + students[i].name + ',' 
        if (students[i].result != null)
            text += students[i].result
        text += ',填寫' + students[i].chooses.length + '志願'
        text += '\n'
    }
    
    fs.writeFileSync('result.csv', text)

    text = ''
    for (let i = 0; i < students.length; i++) {
        text += students[i].account + ',' + students[i].class + ',' + students[i].name + ',' 
        if (students[i].chooses.length > 0)
            for (let j = 0; j < students[i].chooses.length; j++) {
                let temp = await Model.Clubs.findById(students[i].chooses[j])
                text += temp.get('name') + ','
            }
                
        text += '\n'
    }

    fs.writeFileSync('choose.csv', text)

    text = ''
    for (let i = 0; i < clubList.length; i++) {
        text += clubList[i].name + '\n'
        for (let j = 0; j < clubList[i].students.length; j++) {
            text += clubList[i].students[j].account + ',' + clubList[i].students[j].class + ',' + clubList[i].students[j].name + ',' 
            if (clubList[i].students[j].result != null)
                text += clubList[i].students[j].result
            text += ',填寫' + clubList[i].students[j].chooses.length + '志願'
            text += '\n'
        }   
        text += '\n'
    }

    fs.writeFileSync('clubs.csv', text)

    console.log('write result finish!')
    return
}

run()
