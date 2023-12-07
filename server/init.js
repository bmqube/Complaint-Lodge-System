const User = require("./models/User");
const { sysAdmin } = require("./config.json");
const { makeToken } = require("./helpers/utils");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function createSystemAdmin() {
  let sysAdminUser = await User.findOne({
    where: {
      email: sysAdmin.email,
    },
  });

  if (!sysAdminUser) {
    let token = makeToken("USER");
    let hashedPassword = await bcrypt.hash(sysAdmin.password, saltRounds);

    sysAdmin.token = token;
    sysAdmin.password = hashedPassword;

    await User.create(sysAdmin);
  }
}

createSystemAdmin();
