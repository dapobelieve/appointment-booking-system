import * as dotenv from 'dotenv';

dotenv.config();
const DatabaseConfig =
  process.env.NODE_ENV == 'test'
    ? {
        type: 'sqlite',
        database: '../../db/test.sqlite3',
        synchronize: true,
        entities: ['dist/modules/**/*.entity.{ts,js}'],
        migrations: ['dist/db/migrations/**/*.{ts,js}'],
        logging: ['error'],
        logger: 'advanced-console',
      }
    : {
        type: 'postgres',
        host: process.env.TYPEORM_HOST,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        port: process.env.DB_PORT,
        database: process.env.TYPEORM_DATABASE,
        synchronize: false,
        entities: ['dist/modules/**/*.entity.{ts,js}'],
        migrations: ['dist/db/migrations/**/*.{ts,js}'],
        logging: ['error'],
        logger: 'advanced-console',
      };

export default DatabaseConfig;
