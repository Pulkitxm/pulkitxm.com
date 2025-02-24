"use server";

import { auth } from "@/lib/authOptions";
import { MAX_LENGTH_MESSAGE_GUESTBOOK, MAX_NUMBER_MESSAGE_GUESTBOOK_PER_USER } from "@/lib/config";
import { ERRORS } from "@/lib/error";
import { prisma } from "@/lib/prisma";
import { RES_TYPE } from "@/types/globals";
import { GuestbookMessage } from "@/types/guestbook";

export async function getGuestBookMessages(): Promise<RES_TYPE<GuestbookMessage[]>> {
  try {
    const messages = await prisma.message.findMany({
      select: {
        id: true,
        content: true,
        isDeleted: true,
        user: {
          select: {
            name: true,
            image: true,
            id: true,
            isBlocked: true
          }
        },
        createdAt: true,
        updatedAt: true
      },
      where: {
        isDeleted: false,
        user: {
          isBlocked: false
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return {
      status: "success",
      data: messages.map((msg) => ({
        ...msg,
        user: { ...msg.user, image: msg.user.image || "", name: msg.user.name || "" }
      }))
    };
  } catch (error) {
    console.error("Error fetching guestbook messages:", error);
    return { status: "error", error: ERRORS.FAILED_TO_FETCH_MESSAGES };
  }
}

export async function addMessageToGuestBook(
  message: Omit<GuestbookMessage, "id" | "createdAt" | "updatedAt" | "isDeleted">
): Promise<RES_TYPE<GuestbookMessage>> {
  try {
    const session = await auth();

    if (!session) {
      return { status: "error", error: ERRORS.UNAUTHORIZED };
    }

    const userId = Number.parseInt(session.user.id as string);

    if (!userId) {
      return { status: "error", error: ERRORS.USER_NOT_FOUND };
    }

    if (message.content.length > MAX_LENGTH_MESSAGE_GUESTBOOK) {
      return { status: "error", error: ERRORS.MAX_LENGTH_MESSAGE_GUESTBOOK };
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        isBlocked: true
      }
    });

    if (!dbUser) {
      return { status: "error", error: ERRORS.USER_NOT_FOUND };
    }
    if (dbUser?.isBlocked) {
      return { status: "error", error: ERRORS.USER_BLOCKED };
    }

    const dbMessages = await prisma.message.findMany({
      where: {
        userId,
        isDeleted: false
      }
    });

    if (dbMessages.length >= MAX_NUMBER_MESSAGE_GUESTBOOK_PER_USER) {
      return {
        status: "error",
        error: `You can only leave ${MAX_NUMBER_MESSAGE_GUESTBOOK_PER_USER} messages, Create a new account to leave more messages`
      };
    }

    const res = await prisma.message.create({
      data: {
        content: message.content,
        user: {
          connect: {
            id: message.user.id
          }
        }
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true
      }
    });
    return {
      status: "success",
      data: {
        ...message,
        id: res.id,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
        isDeleted: res.isDeleted
      }
    };
  } catch (error) {
    console.error("Error adding message to guestbook:", error);
    return { status: "error", error: ERRORS.FAILED_TO_ADD_MESSAGE };
  }
}

export async function deleteMessageFromGuestBook(id: number): Promise<RES_TYPE<null>> {
  try {
    const session = await auth();

    if (!session) {
      return { status: "error", error: ERRORS.UNAUTHORIZED };
    }
    const userId = Number.parseInt(session.user.id as string);

    const msg = await prisma.message.update({
      where: {
        id
      },
      data: {
        isDeleted: true
      },
      select: {
        userId: true
      }
    });

    if (msg.userId !== userId && !session.user.isAdmin) {
      return { status: "error", error: ERRORS.UNAUTHORIZED };
    }

    if (!msg) {
      return { status: "error", error: ERRORS.MESSAGE_NOT_FOUND };
    }

    return { status: "success", data: null };
  } catch (error) {
    console.error("Error deleting message from guestbook:", error);
    return { status: "error", error: ERRORS.FAILED_TO_ADD_MESSAGE };
  }
}

export async function editMessageInGuestBook(id: number, content: string): Promise<RES_TYPE<Date>> {
  try {
    const session = await auth();

    if (!session) {
      return { status: "error", error: ERRORS.UNAUTHORIZED };
    }

    if (content.length > MAX_LENGTH_MESSAGE_GUESTBOOK) {
      return { status: "error", error: ERRORS.MAX_LENGTH_MESSAGE_GUESTBOOK };
    }

    const userId = Number.parseInt(session.user.id as string);

    const dbUser = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        isBlocked: true
      }
    });

    if (!dbUser) {
      return { status: "error", error: ERRORS.USER_NOT_FOUND };
    }
    if (dbUser?.isBlocked) {
      return { status: "error", error: ERRORS.USER_BLOCKED };
    }

    const msg = await prisma.message.update({
      where: {
        id,
        userId
      },
      data: {
        content
      },
      select: {
        updatedAt: true
      }
    });

    if (!msg) {
      return { status: "error", error: ERRORS.MESSAGE_NOT_FOUND };
    }

    return { status: "success", data: msg.updatedAt };
  } catch (error) {
    console.error("Error editing message in guestbook:", error);
    return { status: "error", error: ERRORS.FAILED_TO_UPDATE_MESSAGE };
  }
}

export async function toggleBlockGuestBookUser(messageId: number): Promise<
  RES_TYPE<{
    userId: number;
    isBlocked: boolean;
  }>
> {
  try {
    const session = await auth();

    if (!session) {
      return { status: "error", error: ERRORS.UNAUTHORIZED };
    }

    if (!session.user.isAdmin) {
      return { status: "error", error: ERRORS.UNAUTHORIZED };
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: {
        userId: true,
        user: {
          select: {
            isBlocked: true
          }
        }
      }
    });
    if (!message) {
      return { status: "error", error: ERRORS.MESSAGE_NOT_FOUND };
    }

    const userId = message.userId;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isBlocked: !message.user.isBlocked
      },
      select: {
        isBlocked: true
      }
    });

    if (!updatedUser) {
      return { status: "error", error: ERRORS.USER_NOT_FOUND };
    }

    return {
      status: "success",
      data: {
        userId,
        isBlocked: updatedUser.isBlocked
      }
    };
  } catch (error) {
    console.error("Error blocking user in guestbook:", error);
    return { status: "error", error: ERRORS.FAILED_TO_BLOCK_USER };
  }
}
