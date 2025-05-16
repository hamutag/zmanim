const express = require("express");
const fetch = require("node-fetch");

const app = express();
const port = process.env.PORT || 3000;

function getTodayDateString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

app.get("/api/zmanim", async (req, res) => {
  try {
    const date = getTodayDateString();
    const url = `https://www.hebcal.com/zmanim?cfg=json&geonameid=295530&tzid=Asia/Jerusalem&date=${date}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log("תשובת Hebcal המלאה:", data);

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
      sofZmanTefila: data.sofZmanTfillaGA || null,
      rabbeinuTam: data.tzeit72min || null,
      candleLighting: data.candle_lighting || null,
      havdalah: data.havdalah || null,
      parasha: data.parashat || null
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