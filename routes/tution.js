const tution_route = require('express').Router();
const auth_teacher = require('../utils/auth_teacher')



tution_route.get('/checking' , (req, res) => {



    res.status(200).json({
        "message" : "working fine"
    })

})


module.exports = tution_route;

