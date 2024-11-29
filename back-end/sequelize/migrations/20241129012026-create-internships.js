'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('internships', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            studentId: {
                type: Sequelize.INTEGER,
                references: { model: 'students', key: 'id' },
                onDelete: 'CASCADE',
            },
            supervisorId: {
                type: Sequelize.INTEGER,
                references: { model: 'supervisors', key: 'id' },
                onDelete: 'CASCADE',
            },
            organizationId: {
                type: Sequelize.INTEGER,
                references: { model: 'organizations', key: 'id' },
                onDelete: 'CASCADE',
            },
            tasks: {
                type: Sequelize.JSON,
                allowNull: false,
            },
            status: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            internshipCloseReason: {
                type: Sequelize.STRING,
            },
            internshipSchedule: {
                type: Sequelize.JSON,
                allowNull: false,
            },
            division: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            classification: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            monthlyStipend: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            transportationAid: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            workSituation: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            periodStartDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            periodExpectedEndDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            organizationSupervisorName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            organizationSupervisorEmail: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            organizationSupervisorPosition: {
                type: Sequelize.STRING,
                allowNull: false,
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
        await queryInterface.dropTable('internships');
    },
};
