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

    const z = data.zmanim || {};

    // חיפוש פרשת השבוע מתוך items
    let parasha = null;
    if (Array.isArray(data.items)) {
      const parashaItem = data.items.find(item => item.category === "parashat");
      if (parashaItem) {
        parasha = parashaItem.title;
      }
    }

    const zmanim = {
      sunrise: z.sunrise || null,
      sunset: z.sunset || null,
      alos: z.alotHaShachar || null,
      chatzois: z.chatzot || null,
      tzeit: z.tzeit42min || null,
      minchaGedola: z.minchaGedola || null,
      minchaKetana: z.minchaKetana || null,
      plagMincha: z.plagHaMincha || null,
      sofZmanShma: z.sofZmanShmaGA || null,
      sofZmanTefila: z.sofZmanTfillaGA || null,
      rabbeinuTam: z.tzeit72min || null,
      candleLighting: z.candle_lighting || null,
      havdalah: z.havdalah || null,
      parasha: parasha
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