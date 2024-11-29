'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('students', 'academicClassId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'academic-classes',
                key: 'id',
            },
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('students', 'academicClassId');
    },
};
