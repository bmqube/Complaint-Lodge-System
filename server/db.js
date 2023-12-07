const { db } = require("./config.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

async function init() {
  try {
    const connection = await mysql.createConnection({
      user: db.user,
      password: db.password,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${db.name};`);
  } catch (error) {
    console.log(error);
  }
}
init();

let sequelize = new Sequelize(db.name, db.user, db.pass, {
  host: db.host,
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
global.sequelize = sequelize;
