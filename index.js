const express = require("express");
const fetch = require("node-fetch");

const app = express();
const port = process.env.PORT || 3000;

app.get("/api/zmanim", async (req, res) => {
  try {
    const response = await fetch("https://www.hebcal.com/zmanim?cfg=json&geonameid=295530&tzid=Asia/Jerusalem");
    const data = await response.json();

    const zmanim = {
      sunrise: data.sunrise,
      sunset: data.sunset,
      alos: data.alos,
      chatzois: data.chatzois,
      tzeit: data.tzeit42min,
      minchaGedola: data.minchaGedola,
      minchaKetana: data.minchaKetana,
      plagMincha: data.plagMincha,
      sofZmanShma: data.sofZmanShmaGA,
      sofZmanTefila: data.sofZmanTfillaGA
    };

    res.json({ success: true, zmanim });
  } catch (error) {
    console.error("שגיאה בשליפת הזמנים:", error);
    res.status(500).json({ success: false, message: "שגיאה בשליפת הזמנים" });
  }
});

app.listen(port, () => {
  console.log(`Zmanim API is running on port ${port}`);
});