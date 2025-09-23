export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "isVerified", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "isVerified");
  }
};
