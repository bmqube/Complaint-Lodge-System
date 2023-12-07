const utils = require("./utils");

const response = (req, res, v) => {
  let dataToSend = {
    responseTimeUTC: utils.utcNow(),
    responseTimeLocal: utils.localNow(),
    responseCode: v.responseCode,
    message: v.message,
    data: v.data,
    errorLog: v.errorLog,
  };

  res.send(dataToSend);
};

exports.response = response;
