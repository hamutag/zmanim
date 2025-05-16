const express = require("express");
const fetch = require("node-fetch");

const app = express();
const port = process.env.PORT || 3000;

app.get("/api/zmanim", async (req, res) => {
  try {
    const response = await fetch("https://www.hebcal.com/zmanim?cfg=json&geonameid=295530&tzid=Asia/Jerusalem");
    const data = await response.json();

    console.log("תשובת Hebcal המלאה:", data); // בדיקה

    const zmanim = {
      sunrise: data.sunrise || null,
      sunset: data.sunset || null,
      alos: data.alos || null,
      chatzois: data.chatzois || null,
      tzeit: data.tzeit42min || null,
      minchaGedola: data.minchaGedola || null,
      minchaKetana: data.minchaKetana || null,
      plagMincha: data.plagMincha || null,
      sofZmanShma: data.sofZmanShmaGA || null,
      sofZmanTefila: data.sofZmanTfillaGA || null
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