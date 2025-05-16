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
    const url = `https://www.hebcal.com/hebcal?cfg=json&v=1&geonameid=295530&tzid=Asia/Jerusalem&maj=on&mf=on&ss=on&c=on&date=${date}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log("תשובת Hebcal Calendar:", data);

    let candleLighting = null;
    let havdalah = null;
    let parasha = null;

    if (Array.isArray(data.items)) {
      data.items.forEach(item => {
        if (item.category === "candles") {
          candleLighting = item.title;
        } else if (item.category === "havdalah") {
          havdalah = item.title;
        } else if (item.category === "parashat") {
          parasha = item.title;
        }
      });
    }

    const zmanim = {
      candleLighting,
      havdalah,
      parasha
    };

    res.json({ success: true, zmanim });
  } catch (error) {
    console.error("שגיאה בשליפת הנתונים:", error);
    res.status(500).json({ success: false, message: "שגיאה בשליפת הנתונים" });
  }
});

app.listen(port, () => {
  console.log(`Zmanim Calendar API is running on port ${port}`);
});