'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('reset-password-tokens', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: false,
            },
            token: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            expiredAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            expiresAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("NOW() + INTERVAL '1 DAY'"),
            },
            createdAt: {
                type: Sequelize.TIME,
                allowNull: false,
                defaultValue: new Date(),
            },
            updatedAt: {
                type: Sequelize.TIME,
                allowNull: true,
                defaultValue: null,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('reset-password-tokens');
    },
};
