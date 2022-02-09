const router = require('express').Router();
const {User, Role, Task, UserRole} = require('../../models');

router.get('/', async(req, res) =>{
    try {
        const userData = await User.findAll({
            include: [{
                model: UserRole,
                attributes:{exclude:['user_id', 'userId']}
            }, 
            {
                model: Task,
                attributes: {exclude: ['user_id']}

               }],
        });
        if(!userData){
            res.status(404).json({message: 'No users at all'});
            return;
        };
        res.status(200).json(userData)
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async(req, res) =>{
    try {
        const userData = await User.findByPk(req.params.id, {
            include: [
                {
                model: Task,  attributes: {exclude: ['title']}
                },
            ],
            include: [{
                model: UserRole,
                include: [
                    {
                        model: Role,
                        attributes:{include:['id', 'role_id']}
                        // attributes: {exclude: ['password']},
                    },
                ],
            }],
        });
        if(!userData){
            res.status(404).json({message: 'No user with this id'});
            return;
        }
        res.status(200).json(userData)
    } catch (err) {
        res.status(500).json(err)
    }
});

router.post('/', async(req, res) =>{
    try {
        const userData = await User.create(req.body);
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err)
    }
});

module.exports = router