import express, { type Application, Request, Response,json } from "express";

export async function createApp(): Promise<Application> {
  const app: Application = express();
  app.use(json());

  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      name: "server",
      description: "server is running good",
    });
  });

  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
      name: "server health",
      description: "server health is running good",
    });
  });

  return app;
}
