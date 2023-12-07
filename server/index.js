const express = require("express");
const app = express();
const cors = require("cors");
require("./db");
sequelize.sync();
require("./associations");
require("./init");
const centralAuth = require("./middleware/centralAuth");
const expressFileupload = require("express-fileupload");
const path = require("path");
const port = 8000;
const native = require("./helpers/native");

app.use("/public", express.static(path.join(__dirname, "files")));
app.use(cors());
app.use(express.json());
app.use(expressFileupload());

app.use("/auth", centralAuth({ baseRoute: "auth" }), require("./api/auth"));
app.use(
  "/complaint",
  centralAuth({ baseRoute: "complaint" }),
  require("./api/complaint")
);
app.use("/user", centralAuth({ baseRoute: "user" }), require("./api/user"));
app.use("/admin", centralAuth({ baseRoute: "admin" }), require("./api/admin"));
app.use(
  "/reviewer",
  centralAuth({ baseRoute: "reviewer" }),
  require("./api/reviewer")
);

app.get("/", (req, res) => {
  native.response(req, res, {
    responseCode: "TRY_AGAIN",
    message: "Are you lost?",
    data: {},
    errorLog: {},
  });
});

app.listen(port, () =>
  console.log(`NSU CLS backend app listening on port ${port}!`)
);
