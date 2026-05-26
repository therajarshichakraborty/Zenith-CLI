import express, { Request, Response } from "express";
import cors from "cors";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();
const port = 4000;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.get("/", async (req: Request, res: Response) => {
  res.json({
    ok: "ok",
  });
});

app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  return res.json(session);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
