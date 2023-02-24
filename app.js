const express = require("express");
const logger = require("morgan");
const cookie = require("cookie");
const path = require("path");
const bp = require("body-parser");

require("dotenv").config();

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(logger("dev"));

/** The action redirects here with the state and current consent cycle */
app.get("/terms", async (req, res, next) => {
  const state = req.query.state;
  const currentCycle = req.query.cycle;

  res.cookie("state", state);
  res.render("terms", { currentCycle });
});

/** This route is handles the redirect back to the login action via /continue when the user consents or declines */
app.post("/continue", async (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || "");
  const state = cookies["state"];

  const consentCycle = {
    consentGiven: req.body.consent,
    consentTimestamp: Date.now(),
  };

  // We are base64 encoding the consent object to send back to the rule.
  // This should instead be encrypted or encoded into a JWT to prevnet tampering
  const data = Buffer.from(JSON.stringify(consentCycle)).toString("base64");
  res.redirect(
    `${process.env.ISSUER_URL}/continue?state=${state}&data=${data}`
  );
});

app.use((err, req, res, next) => {
  res.send(err);
});

app.listen(process.env.PORT, async () => {
  console.log(`Listening on ${process.env.PORT}`);
});
