"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// /src/modules/users/user.model.ts
const sequelize_1 = require("sequelize");
const database_1 = require("../../config/database");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    role: { type: sequelize_1.DataTypes.ENUM("admin", "doctor", "patient"), allowNull: false },
}, { sequelize: database_1.sequelize, modelName: "User" });
exports.default = User;
