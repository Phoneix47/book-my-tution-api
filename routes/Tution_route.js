const tution_route = require('express').Router();
const auth_student = require('../utils/auth_student');
const Tution = require('../models/Tuition');
const auth_teacher = require('../utils/auth_teacher');
const bodyParser = require('body-parser');


tution_route.use(bodyParser.json())


tution_route.get('/list_tution' , auth_student ,  async (req, res) => {
    try {
    
        const tution_list = await Tution.find()
   
    res.status(200).json({
        "data" : tution_list
    })
    } catch (error) {

        res.status(500).json({
            "error" : error
        })
        
    }
    
})

tution_route.post('/add_tution' , auth_teacher, (req, res) => {
    
    try {

        const newTution = new Tution({
            tution_name : req.body.tution_name,
            total_student : req.body.total_student,
            tution_coordinates : req.body.tution_coordinates,
            tution_address : req.body.tution_address,
            demo_class_available: req.body.demo_class_available,
            tution_images: req.body.tution_images
            })

       newTution.save();

        res.status(200).send("Successfully created tution")
        
    } catch (error) {

        res.status(500).send(error)
        
    }

} )

module.exports = tution_route;

