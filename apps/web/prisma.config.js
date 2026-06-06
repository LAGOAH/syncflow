// Hardcode the absolute path to your environment file to bypass Next.js compilation redirection
require('dotenv').config({ path: '/home/lagoah/syncflow/apps/web/.env' });

module.exports = {
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://postgres:cand5b82c3%3F@127.0.0.1:5432/postgres",
  },
};
