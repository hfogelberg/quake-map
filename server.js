const express = require("express"),
  port = process.env.PORT || 80,
  app = express();

app.use("/", express.static(__dirname + "/"));
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

const server = app.listen(3000, () => {
  console.log("Listening on port " + port);
});
