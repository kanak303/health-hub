"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clinic = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../config/database");
class Clinic extends sequelize_1.Model {
}
exports.Clinic = Clinic;
Clinic.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    address: { type: sequelize_1.DataTypes.STRING, allowNull: false },
}, { sequelize: database_1.sequelize, modelName: "Clinic" });
