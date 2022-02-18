export const config = () => ({
  port: Number(process.env.PORT),
  database: {
    type: 'postgres',
    host: process.env.DATABASE_URL,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    entities: ['dist/**/*.entity.js'],
  },
});
