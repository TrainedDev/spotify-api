const express = require('express');
const cors = require('cors');
const apiRoutes = require("./routes/controllerRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

app.use("/", (req, res) => {
    res.send("server is live");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
