const User = require('./User');
const Role = require('./Role');
const UserRole = require('./User_Role');
const Task = require('./Task');


User.hasMany(Task, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Task.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
})

User.hasMany(UserRole, {
    foreignKey: 'user_id',
    onDelete: "CASCADE"
});

UserRole.belongsTo(User, {
    ForeignKey: 'user_id',
    onDelete: 'CASCADE',
});

Role.hasMany(UserRole, {
    foreignKey: 'role_id',
    onDelete: 'CASCADE'
});

UserRole.belongsTo(Role, {
    foreignKey: 'role_id',
    onDelete: 'CASCADE'
});

module.exports = {User, Role, Task, UserRole}