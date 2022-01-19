const {Model, DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model{
    checkPassword(loginPw){
        return bcrypt.compareSync(loginPw,  this.password);
    }
}

User.init(
    {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true, 
            },
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                len: [8],
            },
        },  
    },

{
    hooks: {
        beforeCreate: async(newEmail) =>{
            newEmail.email = await newEmail.email.toLowerCase();
            return newEmail
        },

        beforeUpdate: async(updatedEmail) =>{
            updatedEmail.email = await updatedEmail.email.toLowerCase();
            return updatedEmail
        },

    beforeCreate: async(pass) =>{
        pass.password = await bcrypt.hash(pass.password, 10);
        return pass;
        },
    beforeUpdate: async (updatedPass) =>{
        updatedPass.password = bcrypt.hash(updatedPass.password, 10)
        return updatedPass;
     },
    },

    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
},
);

module.exports = User;