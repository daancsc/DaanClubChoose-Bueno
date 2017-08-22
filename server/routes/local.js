var express = require('express');
var router = express.Router();

var User = require('../app/Service/User.js');

router.post('/', (req, res, next) => {
    User.login(req.body.account, req.body.password).then((result) => {
        res.status(200).json(result)
    }).catch((error) => {
        console.log(error)
        res.status(500).json({status:false})
    })
})

router.get('/status', (req, res, next) => {
    User.getStatus(req.get("Authorization")).then((result) => {
        res.status(200).json(result)
    }).catch((error) => {
        console.log(error)
        res.status(500).json({status:false})
    })
})

router.post('/choose', (req, res, next) => {
    User.setChoose(req.get("Authorization"), req.body).then((result) => {
        res.status(200).json(result)
    }).catch((error) => {
        console.log(error)
        res.status(500).json({status:false})
    })
})

router.get('/clubs', (req, res, next) => {
    User.getClubs(req.get("Authorization")).then((result) => {
        res.status(200).json(result)
    }).catch((error) => {
        console.log(error)
        res.status(500).json({status:false})
    })
})

// /* GET users listing. */
// router.get('/:token', function (req, res, next) {
//     share.getCourses(req.params.token).then((result) => {
//         res.status(200).json(result)
//     }).catch((error) => {
//         console.log(error)
//         res.status(500).json({
//             message: "伺服器錯誤"
//         })
//     })
// });

// router.post('/',function(req, res, next) {
//     share.saveCourses(req.body.body).then((token)=>{
//         res.status(200).json({token:token})
//     }).catch((error) => {
//         console.log(error)
//         res.status(500).json({
//             message: "伺服器錯誤"
//         })
//     })
// })

module.exports = router;
