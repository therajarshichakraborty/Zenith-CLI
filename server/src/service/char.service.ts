import prisma from "../lib/db";

export class ChatService {
  /**
   * Create a new conversation
   * @param {string} userId - User ID
   * @param {string} mode - chat, tool, or agent
   * @param {string} title - Optional conversation title
   */

  async createConversation(userId: string, mode: string = "chat", title: string | null = null) {
    return await prisma.conversation.create({
      data: {
        userId: userId,
        mode: mode,
        title: title || `New ${mode} conversation`,
      },
      include: {
        messages: true,
      },
    });
  }

  async getOrCreateConversation(userId: string, conversationId: string | null = null, mode: string = "chat") {
    if (conversationId) {
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          userId,
        },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (conversation) {
        return conversation;
      }
    }

    return await this.createConversation(userId, mode);
  }

  async addMessage(conversationId: string, role: string, content: string | object) {
    const serializedContent = typeof content === "string" ? content : JSON.stringify(content);

    return await prisma.message.create({
      data: {
        conversationId,
        role,
        content: serializedContent,
      },
    });
  }

  async getUserConversations(userId: string) {
    return await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async deleteConversation(conversationId: string, userId: string) {
    return await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userId,
      },
    });
  }

  async getMessages(conversationId: string) {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    return messages.map((msg) => ({
      ...msg,
      content: this.parseContent(msg.content),
    }));
  }

  async updateTitle(conversationId: string, title: string) {
    return await prisma.conversation.update({
      where: { id: conversationId },
      data: { title },
    });
  }

  parseContent(content: any) {
    try {
      return JSON.parse(content);
    } catch {
      return content;
    }
  }
  formatMessagesForAI(messages: any[]) {
    return messages.map((msg) => ({
      role: msg.role,
      content: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content),
    }));
  }
}
