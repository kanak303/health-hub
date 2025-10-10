'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Check  platform admin already exists
    const existingAdmin = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email = 'gyan.kanakyadav@gmail.com' AND role = 'admin'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Check  clinic admin already exists
    const existingClinicAdmin = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email = 'vershayadav303@gmail.com' AND role = 'clinic_admin'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const usersToInsert = [];

    // Add platform admin if it not exist
    if (existingAdmin.length === 0) {
      usersToInsert.push({
        id: queryInterface.sequelize.fn('gen_random_uuid'),
        name: 'Platform Admin',
        email: 'gyan.kanakyadav@gmail.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        resetToken: null,
        resetTokenExpiry: null
      });
    }

    // Add clinic admin if not  exist
    if (existingClinicAdmin.length === 0) {
      usersToInsert.push({
        id: queryInterface.sequelize.fn('gen_random_uuid'),
        name: 'Clinic Admin',
        email: 'vershayadav303@gmail.com',
        password: hashedPassword,
        role: 'clinic_admin',
        isVerified: true,
        resetToken: null,
        resetTokenExpiry: null
      });
    }

    if (usersToInsert.length > 0) {
      await queryInterface.bulkInsert('Users', usersToInsert);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {
      email: {
        [Sequelize.Op.in]: ['gyan.kanakyadav@gmail.com', 'vershayadav303@gmail.com']
      },
      role: {
        [Sequelize.Op.in]: ['admin', 'clinic_admin']
      }
    });
  }
};