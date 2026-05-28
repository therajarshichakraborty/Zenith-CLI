import express, { Request, Response, Application } from "express";
import cors from "cors";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./lib/auth";

export function createApp(): Application {
  const app: Application = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

  app.use(express.json());
  app.all("/api/auth/{*any}", toNodeHandler(auth));

  app.get("/", async (_req: Request, res: Response) => {
    res.json({
      ok: "ok",
    });
  });

  app.get("/api/me", async (req: Request, res: Response) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    return res.json(session);
  });

  app.get('/', async (_req: Request, res: Response) => {
    const {user_code } =  _req.body
    res.redirect(`http://localhost:3000/device/user_code=${user_code}`) 
  })

  return app;
}
