export default {
  async up(queryInterface: any, Sequelize:any) {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,   
        allowNull: false,
        primaryKey: true,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.ENUM("admin", "doctor", "patient"), allowNull: false },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });

    const tables = await queryInterface.showAllTables();
    if (!tables.includes('Slots')) {
      await queryInterface.createTable('Slots', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        doctorId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Doctors',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        date: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        startTime: {
          type: Sequelize.TIME,
          allowNull: false
        },
        endTime: {
          type: Sequelize.TIME,
          allowNull: false
        },
        status: {
          type: Sequelize.ENUM('available', 'booked', 'cancelled'),
          allowNull: false,
          defaultValue: 'available'
        },
        patientId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'Users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      });

      await queryInterface.addIndex('Slots', ['doctorId', 'date', 'startTime'], {
        unique: true,
        name: 'unique_doctor_slot'
      });
    }
  },

  async down(queryInterface:any) {
    const tables = await queryInterface.showAllTables();
    if (tables.includes('Slots')) {
      await queryInterface.dropTable("Slots");
    }
    if (tables.includes('Users')) {
      await queryInterface.dropTable("Users");
    }
  },
};
