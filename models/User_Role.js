const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class UserRole extends Model {}

UserRole.init(
    {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
       user_id: {
           type: DataTypes.INTEGER,
           references: {
               model: 'user',
               key: 'id',
           }
       },
       role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'role',
            key: 'id',
        }
    }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user_role',
    }
)

module.exports = UserRole;