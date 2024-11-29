'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('students', 'addressId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'addresses',
                key: 'id',
            },
            allowNull: false,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('students', 'addressId');
    },
};
