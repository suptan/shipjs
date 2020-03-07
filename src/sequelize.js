import config from './config';

console.log(config);

const sequelizeConfig = {
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_SCHEMA,
  port: config.DB_PORT,
  host: config.DB_HOST,
  dialect: 'postgres',
};

export const development = sequelizeConfig;
export const test = sequelizeConfig;
export const production = sequelizeConfig;
