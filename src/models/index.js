import Sequelize from 'sequelize';
import config from '../config';
import map from './map';

const sequelize = new Sequelize(
  config.DB_SCHEMA,
  config.DB_USER,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    dialect: 'postgres',
    operatorsAliases: false,
    define: {
      timestamps: true,
      freezeTableName: true,
    },
    benchmark: true,
  }
);

export const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    return 'UP';
  } catch (err) {
    return 'DOWN';
  }
};

const db = {
  maps: sequelize.import('map', map),
};

Object.keys(db).forEach(model => {
  if (db[model].associate) {
    db[model].associate(db);
  }
});

db.sequelize = sequelize; // Configured model
db.Sequelize = Sequelize; // Sequelize library

export default db;
