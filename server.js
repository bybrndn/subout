import express from "express";
import fetch from "node-fetch";
import "dotenv/config";

const app = express();
app.use(express.json());

const BASE = https://api.github.com/repos/${process.env.GITHUB_USER}/${process.env.GITHUB_REPO}/contents/data/games.json;

app.get("/games", async (req, res) => {
const r = await fetch(BASE + "?ref=main", {
headers: {
Authorization: Bearer ${process.env.GITHUB_TOKEN},
Accept: "application/vnd.github+json"
}
});

const json = await r.json();
const data = JSON.parse(Buffer.from(json.content, "base64").toString());
res.json(data);
});

app.listen(3000);

Frontend change

Replace GitHub calls with:

fetch("/games")
.then(r => r.json())
.then(data => console.log(data));

If you need saving (write access)

Add this route:

app.post("/games", async (req, res) => {
const file = await fetch(BASE + "?ref=main", {
headers: {
Authorization: Bearer ${process.env.GITHUB_TOKEN}
}
});

const current = await file.json();
const sha = current.sha;

const content = Buffer.from(JSON.stringify(req.body, null, 2)).toString("base64");

const update = await fetch(BASE, {
method: "PUT",
headers: {
Authorization: Bearer ${process.env.GITHUB_TOKEN},
"Content-Type": "application/json"
},
body: JSON.stringify({
message: "update games",
content,
sha,
branch: "main"
})
});

res.json(await update.json());
});

Frontend save:

fetch("/games", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(data)
});
