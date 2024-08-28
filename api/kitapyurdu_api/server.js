const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const app = express();
const port = process.env.PORT || 5002;
app.use(cors());

async function run() {
  app.use("/api/fetch", routes);

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

run();
