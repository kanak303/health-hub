'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "ALTER TYPE \"enum_Users_role\" ADD VALUE 'clinic_admin';"
    );
  },

  down: async (queryInterface, Sequelize) => {

    throw new Error('Cannot rollback enum value addition in PostgreSQL');
  }
};