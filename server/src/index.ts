import express from "express";
import { AREAS } from "./constants/areas";


const app = express();
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(PORT, () => {
    console.log(AREAS.length)
    console.log(`Server is running on PORT ${PORT}`);
})