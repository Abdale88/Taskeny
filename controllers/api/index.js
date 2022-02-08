const router = require('express').Router()
const userRoutes = require('./user');
const taskRoutes = require('./task');

router.use('/users', userRoutes);
router.use('/task', taskRoutes);

module.exports = router;