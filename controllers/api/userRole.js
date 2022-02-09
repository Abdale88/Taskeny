const router = require('express').Router();
const res = require('express/lib/response');
const {UserRole, User, Role} = require('../../models');

router.get('/', async(req, res) => {
    try {
        const userData = await UserRole.findAll({
            include: [
                {
                  model: Role,
                },
                {
                  model: User,
                  attributes: {
                    exclude: ['password'],
                  },
                },
              ],
        });
        if(!userData){
            res.status(404).json({message: "No User Roles are available"});
            return;
        }
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json(err);
    }
});

router.get('/:id', async(req, res) =>{
    try {
        const userData = await  UserRole.findByPk(req.params.id, {
            include: [{model: User}, {model: Role}]
        });
        if(!userData){
            res.status(404).json({message: "No User With is ID is available"});
        }
        res.status(200).json(userData);
    } catch (err) {
        res.status(200).json(userData);
    }
})

router.post('/', async(req, res) =>{
    try{
        const userData = await  UserRole.create(req.body);
        res.status(200).json(userData)
    }catch(err){
        res.status(500).json(err)
    }
});

module.exports = router;