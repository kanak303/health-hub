module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Users", [
      {
        id: "11111111-1111-1111-1111-111111111111",
        name: "Admin User",
        email: "admin@healthhub.com",
        password: "hashedpassword",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
