let Model = require('./Model')
let Promise = require('bluebird')
let _ = require('lodash')
let fs = require('fs')

let isReject = function (stu, rejectList) {
    let stuClass = stu.class[0]+stu.class[1]
    let reject = false
    if (rejectList==null) {
        return false
    }
    rejectList.split(',').forEach(i=>{
        if (stuClass==i) {
	    reject = true
	}
    })
    return reject
}

let searchClubId = (name ,club) => {
    let id = 0
    club.forEach(i=>{
        if (name == i.name) {
	    id = i.id
	}
    })
    return id
}

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
            choosesLen: 0,
	    result: '0',
	    step: 0
        }
        if (chooses.length > 0) {
            temp.Constantchooses = chooses[0]['chosens'].split(',')
            temp.chooses = chooses[0]['chosens'].split(',')
	    temp.choosesLen = temp.chooses.length
        } else {
            temp.Constantchooses = []
            temp.chooses = []
        }
        students.push(temp)
    }
    
    let clubList = []
    let people = 0
    for (let i = 0; i < clubs.length; i++) {
        let club = {
            id: clubs[i].get('id'),
            name: clubs[i].get('name'),
            reject: clubs[i].get('reject'),
            max: clubs[i].get('max'),
            students: []
        }
	people += club.max
        clubList.push(club)
    }
    console.log(people)
    for (let n = 0;n < 15; n++) {   
        clubList.forEach(i=>{
            let arr = _.filter(students, j=>{
	        return (j.result=='0'&&j.chooses.length!=0&&j.chooses[0]==i.id)
 	    })
	    arr = _.shuffle(arr)
     	    arr.forEach(j=>{
	        if (i.max>0) {
	            students.forEach(k=>{
		        if (k.account==j.account) {
		            k.step++
		            k.result = i.name
		        }
		    })
	            i.students.push(j)
		    i.max--
	        } else {
	            students.forEach(k=>{
		        if (k.account == j.account) {
		            k.step++
		            k.chooses.shift()
		        }
		    })
	        }
	    })
        })
    }
    /*
    for (let k = 0;k<15;k++) {
        clubList.forEach(i=>{
            students = _.shuffle(students)
            students.forEach(j=>{
	        if (j.chooses.length && j.choosesLen && j.result=='0'){
		    if (i.id==j.chooses[k]) {
		        if (i.max>0) {
                            j.result = i.name
			    j.step = k+1
		            i.students.push(j)
	                    i.max--
		        }
	            }
	        }
	    })
        })
    }
    */
    console.log('random')
    clubList.forEach(i=>{
	for (let k = 0;k<15;k++) {
            students.forEach(j=>{
	        if (j.result=='0'){
		    if (!isReject(j, i.reject)) {
		        if (i.max>0) {
                            j.result = i.name
			    j.step = 'random'
		            i.students.push(j)
	                    i.max--
		        }
	            }
	        }
	    })
	}
    })
    
    console.log('deal finish!')
    console.log('write data in DB!')

    
    students.forEach(i=>{
        let account = i.account
	let result = searchClubId(i.result, clubList)
        if (i.step=='random') {
	    i.step = '隨機'
	}
	Model.Student.update({result: result}, {where: {account: account}})
    })
    

    console.log('write data in CSV!')
    let text = '\ufeff'
    
    for (let i = 0; i < students.length; i++) {
        text += `"${students[i].account}","${students[i].class}","${students[i].name}","${students[i].result}"` 
        text += `,"填寫${students[i].choosesLen}志願"`
	text += `,"第${students[i].step}志願"`
        text += '\n'
    }
    
    fs.writeFileSync('result.csv', text, {encoding: 'utf8'})

    text = '\ufeff'
    for (let i = 0; i < students.length; i++) {
        text += `"${students[i].account}","${students[i].class}","${students[i].name}"` 
        if (students[i].choosesLen > 0) {
            for (let j = 0; j < students[i].choosesLen; j++) {
                let temp = await Model.Clubs.findById(students[i].Constantchooses[j])
                text += `,"${temp.get('name')}"`
            }
	}
        text += '\n'
    }

    fs.writeFileSync('choose.csv', text, {encoding: 'utf8'})

    text = '\ufeff'
    for (let i = 0; i < clubList.length; i++) {
        text += clubList[i].name + '\n'
        for (let j = 0; j < clubList[i].students.length; j++) {
            text += `"${clubList[i].students[j].account}","${clubList[i].students[j].class}","${clubList[i].students[j].name}",` 
            text += `"${clubList[i].students[j].result}"`
            text += `,"填寫${clubList[i].students[j].choosesLen}志願"`
	    text += `,"第${clubList[i].students[j].step}志願"`
            text += '\n'
        }   
        text += '\n'
    }

    fs.writeFileSync('clubs.csv', text, {encoding: 'utf8'})

    console.log('write result finish!')
    
    return
}

run()
