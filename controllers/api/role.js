const router = require('express').Router();
const {Role, UserRole} = require('../../models');

router.get('/', async(req, res) =>{
    try{
        const userData = await Role.findAll({
            // include: [{UserRole}]
        });
        if(!userData){
            res.status(404).json({message: "No Roles are available"});
            return;
        }
        res.status(200).json(userData)
    }catch(err){
        res.status(500).json(err);
    }
});

router.get('/:id', async(req, res) =>{
    try{
        const userData = await Role.findByPk(req.params.id, {
            include: [{UserRole}]
        });
        if(!userData){
            res.status(404).json({message: "No Role With This ID is available"});
            return;
        }
        res.status(200).json(userData);
    }catch(err){
        res.status(500).json(err)
    }
})


router.post('/', async(req, res) =>{
    try {
        const userData = await Role.create(req.body);
        res.status(200).json(userData)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.delete('/:id', async(req, res) =>{
    try {
        const userData = await Role.destroy({
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