import Sequelize from 'sequelize';
import config from '../config';
import fleet from './fleets';
import gameplay from './gameplays';
import levelFleet from './level-fleets';
import level from './levels';
import map from './map';
import player from './players';
import ship from './ships';
import gameplayPlayers from './gameplay-players';

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
  fleet: sequelize.import('fleet', fleet),
  gameplay: sequelize.import('gameplay', gameplay),
  levelFleet: sequelize.import('levelFleet', levelFleet),
  level: sequelize.import('level', level),
  map: sequelize.import('map', map),
  player: sequelize.import('player', player),
  ship: sequelize.import('ship', ship),
  gameplayPlayer: sequelize.import('gameplay_player', gameplayPlayers),
};

Object.keys(db).forEach(model => {
  if (db[model].associate) {
    db[model].associate(db);
  }
});

db.sequelize = sequelize; // Configured model
db.Sequelize = Sequelize; // Sequelize library

export default db;
