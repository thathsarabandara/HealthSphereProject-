const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); 
const {User} = require('../auth/User');

const Patient = sequelize.define('Patient', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    User_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profilePictureLocation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'patients',
    timestamps: false,
    indexes: [
        {
            fields: ['first_name'], 
        },
        {
            fields: ['last_name'], 
        },
        {
            fields: ['phone_number'], 
        },
        

    ],
});
const createPatient = async (id,first_name, last_name, date_of_birth, gender, phone_number, address)=>{
    try{
        const newPatient = await Patient.create({
            User_id: id,
            first_name: first_name,
            last_name: last_name,
            date_of_birth: date_of_birth,
            gender: gender,
            phone_number: phone_number,
            address: address
        });
        return newPatient;
    }catch(err){
        console.error('Failed to create New Patient :', err)
    }
}

module.exports = {
    Patient,
    createPatient,
};
