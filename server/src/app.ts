import express, { Request, Response, Application } from "express";
import cors from "cors";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./lib/auth";
import prisma from "./lib/db";
import { ChatService } from "./service/chat.service";

export function createApp(): Application {
  const app: Application = express();
  const chatService = new ChatService();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

  app.use(express.json());
  app.all("/api/auth/{*any}", toNodeHandler(auth));

  // Middleware to authenticate requests via Bearer Token or Cookie Session
  const requireUser = async (req: Request, res: Response, next: () => void) => {
    try {
      let user = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        if (token) {
          const session = await prisma.session.findUnique({
            where: { token },
            include: { user: true },
          });
          if (session && (!session.expiresAt || new Date(session.expiresAt) > new Date())) {
            user = session.user;
          }
        }
      }

      if (!user) {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
        });
        if (session?.user) {
          user = session.user;
        }
      }

      if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      (req as any).user = user;
      next();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

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

  app.get("/api/user/whoami", requireUser, (req: Request, res: Response) => {
    res.json({ success: true, user: (req as any).user });
  });

  app.post("/api/chats", requireUser, async (req: Request, res: Response) => {
    try {
      const { conversationId, mode } = req.body;
      const user = (req as any).user;
      const conversation = await chatService.getOrCreateConversation(user.id, conversationId, mode || "chat");
      res.json(conversation);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/chats/message", requireUser, async (req: Request, res: Response) => {
    try {
      const { conversationId, role, content } = req.body;
      if (!conversationId || !role || content === undefined) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      const message = await chatService.addMessage(conversationId, role, content);
      res.json(message);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/chats/:conversationId/messages", requireUser, async (req: Request, res: Response) => {
    try {
      const { conversationId } = req.params;
      //@ts-ignore
      const messages = await chatService.getMessages(conversationId);
      res.json(messages);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/chats/:conversationId/title", requireUser, async (req: Request, res: Response) => {
    try {
      const { conversationId } = req.params;
      const { title } = req.body;
      if (!title) {
        res.status(400).json({ error: "Missing title" });
        return;
      }
      //@ts-ignore
      const conversation = await chatService.updateTitle(conversationId, title);
      res.json(conversation);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/device", async (req: Request, res: Response) => {
    const user_code = req.query.user_code || "";
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${frontendUrl}/device?user_code=${user_code}`);
  });

  return app;
}

