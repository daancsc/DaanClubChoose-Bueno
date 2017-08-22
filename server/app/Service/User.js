let redis = require('./Redis')
let Model = require('./Model')
let Promise = require('bluebird')
let crypto = require('crypto')

let login = (account, password) => {
  return new Promise((resolve, reject) => {
    Model.Student.count({ where: { account: account, password: password } }).then(c => {
      if (c !== 0) {
        crypto.randomBytes(48, function(err, buffer) {
          let token = buffer.toString('hex');
          redis.set(token, account).then(() => {
            return redis.exists(token,1800)
          }).then(() => {
            resolve({status:true,token:token})
          }).catch((error) => {
            reject(error)
          })
        })
      } else {
        reject("no account or wrong password")
      }
    }).catch((error) => {
      reject(error)
    })
  })
}

let getStatus = (token) => {
  return new Promise((resolve, reject) => {
    var result = {}
    redis.get(token).then((value) => {
      return Model.Student.findOne({ where: { account: value} })
    }).then(student => {
      result.name = student.get('name')
      result.class = student.get('class')
      return Model.Choose.findAll({ where: {stu_id: student.id} })
    }).then(chooses => {
      Model.Clubs.findAll().then((clubs) => {
        result.choose = []
        for (let i = 0;i < chooses.length; i++) {
          for (let j = 0;j < clubs.length; j++) {
            if (clubs[j].get('id') == chooses[i].get('club_id')) {
              let temp = { id: chooses[i].get('club_id'), name: clubs[j].get('name')}
              if (chooses[i].get('more') != '') {
                temp.more = chooses[i].get('more').split(',')
              }
              result.choose.push(temp)
              break
            }
          }
        }
        resolve(result)
      }).catch((error) => {
        reject(error)
      })
    }).catch((error) => {
      reject(error)
    })
  })
}

let setChoose = (token, chooses) => {
  return new Promise((resolve, reject) => {
    redis.get(token).then((value) => {
      return Model.Student.findOne({ where: { account: value} })
    }).then(student => {
      Model.Choose.destroy({where:{stu_id: student.get('id')}}).then(() => {
        for (let i = 0; i < chooses.length; i++) {
          Model.Choose.create({ stu_id: student.get('id'), step: (i+1), club_id: chooses[i].id, more: (chooses[i].more === undefined)?'':chooses[i].more.join(',') }).then()
        }
        resolve({status: true})
      })
    })
  })
}

let getClubs = (token) => {
  return new Promise((resolve, reject) => {
    redis.get(token).then((value) => {
      return Model.Student.findOne({ where: { account: value} })
    }).then(student => {
      Model.Clubs.findAll().then((clubs) => {
        var result = []
        for (let i = 0; i < clubs.length; i++) {
          result.push({id: clubs.get('id'), name: clubs.get('name')})
        }
        resolve(result)
      })
    })
  })
}

module.exports = {
  login: login,
  getStatus: getStatus,
  setChoose: setChoose,
  getClubs: getClubs
}
