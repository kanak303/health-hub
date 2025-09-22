import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export default {
  async up(queryInterface:any) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await queryInterface.bulkInsert("Users", [
      {
        id: uuidv4(),
        name: "kanak",
        email: "kanak@healthhub.com",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "shashi",
        email: "shashi@healthhub.com",
        password: hashedPassword,
        role: "doctor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "arush",
        email: "arush@healthhub.com",
        password: hashedPassword,
        role: "patient",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface:any) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
