const router = require('express').Router();
const { User, Role, Task, UserRole } = require('../../models');
const withAuth = require('../../utils/auth')


router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);
        res.status(200).json(userData);
        res.redirect('/login')
    } catch (err) {
        res.status(500).json(err)
    }
});

router.post('/login', async (req, res) => {
    try {

        const userData = await User.findOne({
            where: { email: req.body.email },
            include: [
                {
                    model: Task,
                    plain: true,
                    nest: true,
                },
                {
                    model: UserRole,
                    include: [
                        {
                            model: Role,
                            plain: true,
                            nest: true,
                        }
                    ],
                    plain: true,
                    nest: true,
                }
            ]
        });

        if (!userData) {
            res.status(400).json({ message: "Incorrect email, please try again" });
            return;
        }
        // Verify the posted password with the password store in the database
        const validPassword = await userData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: "Incorrect password, please try again" });
            return;
        }

        const user = userData.get({ plain: true, nest: true });
        // Create session variables based on the logged in user
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            const role_ids = user.user_roles.map((userRoles) => {
                return userRoles.role.id;
            });

            req.session.is_admin = role_ids.includes(1);

            const { password, ...userResponse } = user;
            res.json({ user: userResponse, message: "You are logged in!" })
        })

    } catch (err) {
        console.log('---------------------')
        console.log("this is th error ", err)
        res.status(500).json(err)
    }
})

router.post('/logout', withAuth, async(req, res) =>{
    if(req.session.logged_in){
        req.session.destroy(() =>{
            res.status(204).end();
        });
    }else{
        res.status(404).end();
    }
});

// Find all the users
router.get('/', withAuth, async (req, res) => {
    try {
        const userData = await User.findAll({
            attributes: {exclude: ['password']},
            include: [
                {
                    model: Task,
                    attributes: { exclude: ['user_id'] }

                },
                {
                    model: UserRole,
                    attributes: { exclude: ['user_id', 'userId',],},
                    include: [{ model: Role }]
                }],
        })
        if(!userData){
            res.status(404).json({ message: 'No users are available '})
            return;
        }
        const users = userData.map((user) => user.get({ plain: true}));

        res.status(200).json({
           users,
           is_admin: req.session.is_admin,
           logged_in: req.session.logged_in,
        })
    } catch (err) {
        res.status(500).json(err);
    }
})

// find one user using his/her id
router.get('/:id', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.params.id, {
            attributes: {exclude: ['password']},
            include: [
                {
                    model: Task,
                    attributes: { exclude: ['user_id'] }

                },
                {
                    model: UserRole,
                    attributes: { exclude: ['user_id', 'userId',],},
                    include: [{ model: Role }]
                }],
        });
        if (!userData) {
            res.status(404).json({ message: 'No user with this id' });
            return;
        }
        const user = userData.get({ plain: true});
        res.status(200).json({
            user,
            is_admin: req.session.is_admin,
            logged_in: req.session.logged_in
        })
    } catch (err) {
        res.status(500).json(err)
    }
});

router.put('/:id', withAuth, async (req, res) =>{
    try {
       const user = await User.update(
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
            },
            {
                where: {
                    id: req.params.id
                },
            }
        );
        if(!user){
            res.status(404).json({ message: "No User With This ID"})
        }
        const updatedUser = await User.findByPk(req.params.id, {
            attributes: {exclude: ['password']},
            include: [
                {
                    model: Task,
                    attributes: { exclude: ['user_id'] }

                },
                {
                    model: UserRole,
                    attributes: { exclude: ['user_id', 'userId',],},
                    include: [{ model: Role }]
                }],
        })
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router