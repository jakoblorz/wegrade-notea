import { Sequelize } from "sequelize";
import EncryptedField from "sequelize-encrypted";

export default () => EncryptedField(Sequelize, process.env.SECRET_KEY);