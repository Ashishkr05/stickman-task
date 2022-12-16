import Data from "../models/data.js";
import ejs from "ejs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const pdfController = async (req, res) => {
  if (req.auth?.type !== "admin") {
    return res.redirect("/login-admin");
  }
  let { left, right } = req.body;

  const data = await Data.find({
    id: {
      $gt: String(left || "0000"),
      $lt: String(right || "9999"),
    },
  });
  if (data.length === 0) {
    res.render("admin", {
      username: req.auth.username,
      right,
      left,
      data,
      err: data.length === 0 && "No data in given range",
    });
  }
  const html = await ejs.renderFile(
    path.join(__dirname, "..", "views", "tables.ejs"),
    {
      data,
    }
  );
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html);
  const buffer = await page.pdf({
    margin: 10
  })
  res.setHeader('Content-Length', buffer.length);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
  return res.send(buffer);
};
