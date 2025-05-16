const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function fetchZmanim2Net() {
  const url = "https://calendar.2net.co.il/todaytimes.aspx?city=%D7%A2%D7%A4%D7%95%D7%9C%D7%94&methodid=3";
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ZmanimFetcher/1.0)'
    }
  });
  const html = await res.text();
  const $ = cheerio.load(html);

  // שליפת כותרת פרשת השבוע
  let parasha = $('.parasha').first().text().trim();
  if (!parasha) {
    // חיפוש פרשה מהכותרת הראשית
    parasha = $('h2').first().text().trim().split('-')[1]?.trim() || null;
  }

  // שליפת זמני יום
  const zmanim = {};
  $('.table_times tr').each((i, el) => {
    const label = $(el).find('td').eq(0).text().trim();
    const value = $(el).find('td').eq(1).text().trim();
    if(label && value) {
      zmanim[label] = value;
    }
  });

  // שליפת הדלקת נרות, צאת שבת, רבנו תם
  const candleLighting = zmanim['הדלקת נרות'] || null;
  const havdalah = zmanim['צאת השבת'] || null;
  const rabbeinuTam = zmanim['צאת השבת לרבנו תם'] || null;

  return {
    parasha,
    candleLighting,
    havdalah,
    rabbeinuTam,
    zmanim
  };
}

// דוגמת הרצה
fetchZmanim2Net().then(console.log).catch(console.error);