"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// /src/db/associations.ts
const userModels_1 = require("../modules/user/userModels");
const clinicModels_1 = require("../modules/clinic/clinicModels");
// Example associations
userModels_1.User.hasMany(clinicModels_1.Clinic, { foreignKey: "ownerId" });
clinicModels_1.Clinic.belongsTo(userModels_1.User, { as: "owner", foreignKey: "ownerId" });
