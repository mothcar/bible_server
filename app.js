const express = require("express");
let iconv = require("iconv-lite");
const axios = require("axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/bible", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    // 새로운 페이지를 연다.
    const page = await browser.newPage();
    // 페이지의 크기를 설정한다.
    // await page.setViewport({
    //   width: 1366,
    //   height: 768,
    // });

    const { CI, CV } = req.query;
    // const url = `http://www.holybible.or.kr/B_GAE/cgi/bibleftxt.php?VR=9&CI=${CI}&CV=${CV}`;
    const url = `http://www.holybible.or.kr/B_GAE/cgi/bibleftxt.php?VR=9&CI=517&CV=99`;
    // const response = await axios.get(url);
    await page.goto(url);
    const content_pet = await page.content();
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      responseEncoding: "binary",
    });
    const content = iconv.decode(response.data, "euc-kr");
    // const decoder = new TextDecoder('euc-kr');
    // const content = decoder.decode(response.data);
    console.log("Res : ", content);
    const $ = cheerio.load(content_pet);
    const text = $(".tk3").text().trim();
    console.log("Text : ", text);
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bible text" });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
