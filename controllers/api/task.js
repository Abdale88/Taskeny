const router = require('express').Router();
const {Task} = require('../../models');

router.get('/', async(req, res) =>{
    try {
        const userData = await Task.findAll();
        if(!userData){
            res.status(404).json({message: 'No Tasks available'});
            return;
        }
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/:id', async(req, res) =>{
    try {
        const userData = await Task.findByPk(req.params.id);
        if(!userData){
            res.status(404).json({message: 'No Task With this id is available'});
            return;
        }
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.post('/', async(req, res) =>{
    try {
        const userData = await Task.create(req.body);
        res.status(200).json(userData)
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete('/:id', async(req, res) =>{
    try {
        const userData = await Task.destroy({
            where:{
                id: req.params.id
            }
        })
        if(!userData){
            res.status(404).json({message: "No Role Found With That ID"})
        }
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router;