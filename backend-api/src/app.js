/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const express = require("express");
const cors = require("cors");

const app = express();

const JSend = require("./jsend");

const fieldsRouter = require("./routes/fields.router");
const adminRouter = require("./routes/admin.router");
const usersRouter = require("./routes/users.router");
const itemsRouter = require("./routes/item.router");

const reservationUser = require("./routes/user_reservations.router");
const admin_reservations = require("./routes/admin_reservations.router");

const {
  resourceNotFound,
  handleError,
} = require("./controllers/errors.controller");

const { specs, swaggerUi } = require("./docs/swagger");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.json(JSend.success());
});

app.use("/public", express.static("public"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

fieldsRouter.setup(app);
adminRouter.setup(app);
usersRouter.setup(app);
itemsRouter.setup(app);
admin_reservations.setup(app);

reservationUser.setup(app);

app.use(resourceNotFound);
app.use(handleError);

module.exports = app;