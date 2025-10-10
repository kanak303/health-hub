'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Doctors', 'clinic_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Clinics',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Doctors', 'clinic_id');
  }
};