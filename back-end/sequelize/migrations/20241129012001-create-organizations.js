'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('organizations', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            addressId: {
                type: Sequelize.INTEGER,
                references: { model: 'addresses', key: 'id' },
                onDelete: 'SET NULL',
            },
            cnpj: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            corporateName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            businessName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            phone1: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            phone2: {
                type: Sequelize.STRING,
            },
            website: {
                type: Sequelize.STRING,
            },
            whatsapp: {
                type: Sequelize.STRING,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('organizations');
    },
};
