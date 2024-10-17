export default () => ({
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: '1d',
  },
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});
