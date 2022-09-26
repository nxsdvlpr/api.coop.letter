const ormConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  synchronize: false,
  entities: ['dist/**/*.entity{.ts,.js}', 'dist/**/**/*.entity{.ts,.js}'],
  migrationsTableName: 'typeorm_migrations',
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
  cli: {
    migrationsDir: 'migrations',
  },
  subscribers: ['dist/src/**/*.subscriber.js'],
};

if (process.env.DB_SSL === 'true') {
  ormConfig['ssl'] = { rejectUnauthorized: false };
}

module.exports = ormConfig;
