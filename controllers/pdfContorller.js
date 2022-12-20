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
  let leftDate = new Date(left || 0),
    rightDate = right ? new Date(right) : new Date();

  const data = await Data.aggregate([
    {
      $addFields: {
        created_on: { $toDate: "$_id" },
      },
    },
    {
      $match: {
        created_on: {
          $gt: leftDate,
          $lt: rightDate,
        },
      },
    },
    { $group: { _id: null, name: { $addToSet: "$name" } } },
    { $unwind: "$name" },
    { $project: { _id: 0 } },
  ]);

  if (data.length === 0) {
    res.render("admin", {
      username: req.auth.username,
      right,
      left,
      data,
      err: data.length === 0 && "No data in given range",
    });
  }
  const tables = [];
  for (let { name } of data) {
    const nD = await Data.aggregate([
      {
        $addFields: {
          created_on: { $toDate: "$_id" },
        },
      },
      {
        $match: {
          created_on: {
            $gt: leftDate,
            $lt: rightDate,
          },
          name
        },
      },
    ]);
    tables.push(nD);
  }
  const html = await ejs.renderFile(
    path.join(__dirname, "..", "views", "tables.ejs"),
    {
      data: tables,
    }
  );
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(html);
  const buffer = await page.pdf({
    margin: 10,
  });
  await browser.close();
  res.setHeader("Content-Length", buffer.length);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=quote.pdf");
  return res.send(buffer);
};
