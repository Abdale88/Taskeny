const router = require('express').Router()
const userRoutes = require('./user');
const taskRoutes = require('./task');
const roleRoutes = require('./role');
const userRoleRoutes = require('./userRole');

router.use('/users', userRoutes);
router.use('/task', taskRoutes);
router.use('/role', roleRoutes);
router.use('/userRole', userRoleRoutes);

module.exports = router;