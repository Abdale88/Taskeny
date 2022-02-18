const router = require('express').Router();
const path = require('path');
const {User, Role, Task, UserRole} = require('../models');
const withAuth = require('../utils/auth')


// router.get('/login', (req, res) =>{
//   res.sendFile(path.join(__dirname, '../public/login.html'))
// })

// find one user
router.get('/', withAuth, async (req, res) => {
  try {
      const userData = await User.findByPk(req.session.user_id,{
          attributes: {exclude: ['password']},
          include: [
              {
                  model: Task,
                  attributes: { exclude: ['user_id'] }

              },
              {
                  model: UserRole,
                  attributes: { exclude: ['user_id', 'userId'] },
                  include: [{ model: Role }]
              }],
      });
      if (!userData) {
          res.status(404).json({ message: 'No users at all' });
          return;
      };
      const user = userData.get({ plain: true });
      console.log('session req ', req.session)
      res.status(200).json({ 
          user,
          is_admin: req.session.is_admin,
          logged_in: req.session.logged_in
       })
  } catch (err) {
      res.status(500).json(err);
  }
});

// should able render all the users so the admin can assign their roles
router.get('/admin', withAuth, async(req, res) =>{
  try {
      const userData = await User.findByPk(req.params.user_id, {
          attributes: {exclude: ['password']},
          include: [
              {
                  model: Task,
              },
              {
                  model: UserRole,
                  include: [{ model: Role}]
              }
          ]
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
})
// Find all the users
router.get('/users', withAuth, async (req, res) => {
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
router.get('/user/:id', async (req, res) => {
  try {
      const homeUserData = await User.findByPk(req.session.user_id, {
          attributes: {exclude: ['password']},
      });
      const userData = await User.findOne({
        where: {id: req.params.id},
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
      if (!homeUserData) {
          res.status(404).json({ message: 'No user with this id' });
          return;
      }
      const user = userData.get({plain: true});
      const home_user = homeUserData.get({ plain: true});
      res.status(200).json({
          home_user,
          user,
          is_admin: req.session.is_admin,
          logged_in: req.session.logged_in
      })
  } catch (err) {
      res.status(500).json(err)
  }
});

router.get('signup', async(req, res) =>{
  if(req.session.logged_in){
      redirect('/');
      return;
  }
  try{
      // not finish
      res.status(200).json({
          logged_in: req.session.logged_in,
          // layout: 'empty.handlebars'
      })
  }catch(err){
      res.status(500).json(err);
  }
})

router.get('/login', async (req, res) =>{
  if(req.session.logged_in){
      res.redirect('/');
      return;
  }
  try {
      res.status(200).json({
          // layout: 'empty.handlebars'
      })
  } catch (err) {
      res.status(500).json(err);
  }
})

module.exports = router;