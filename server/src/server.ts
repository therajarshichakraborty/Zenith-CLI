import { createServer } from "node:http";
import { createApp } from "./app";
import { Application } from "express";

async function main(): Promise<void> {
  const port = process.env.PORT || 4000;

  const app: Application = createApp();
  const server = createServer(app);

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

main()
  .then(() => {
    console.log("The server is up and running");
  })
  .catch((error) => {
    console.error("Server failed to start:", error);
  });
