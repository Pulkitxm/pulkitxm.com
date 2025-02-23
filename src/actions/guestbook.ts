"use server";

import { auth } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { RES_TYPE } from "@/types/globals";
import { GuestbookMessage } from "@/types/guestbook";

export async function getGuestBookMessages(): Promise<RES_TYPE<GuestbookMessage[]>> {
  try {
    const messages = await prisma.message.findMany({
      select: {
        id: true,
        content: true,
        user: {
          select: {
            name: true,
            image: true,
            id: true
          }
        },
        createdAt: true,
        updatedAt: true
      },
      where: {
        isDeleted: false
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
    return { status: "error", error: "Failed to fetch messages" };
  }
}

export async function addMessageToGuestBook(
  message: Omit<GuestbookMessage, "id" | "createdAt" | "updatedAt">
): Promise<RES_TYPE<GuestbookMessage>> {
  try {
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
        updatedAt: true
      }
    });
    return {
      status: "success",
      data: {
        ...message,
        id: res.id,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt
      }
    };
  } catch (error) {
    console.error("Error adding message to guestbook:", error);
    return { status: "error", error: "Failed to add message" };
  }
}

export async function deleteMessageFromGuestBook(id: number): Promise<RES_TYPE<null>> {
  try {
    const session = await auth();

    if (!session) {
      return { status: "error", error: "Unauthorized" };
    }
    const userId = Number.parseInt(session.user.id as string);

    const msg = await prisma.message.update({
      where: {
        id,
        userId
      },
      data: {
        isDeleted: true
      }
    });

    if (!msg) {
      return { status: "error", error: "Message not found" };
    }

    return { status: "success", data: null };
  } catch (error) {
    console.error("Error deleting message from guestbook:", error);
    return { status: "error", error: "Failed to delete message" };
  }
}

export async function editMessageInGuestBook(id: number, content: string): Promise<RES_TYPE<Date>> {
  try {
    const session = await auth();

    if (!session) {
      return { status: "error", error: "Unauthorized" };
    }
    const userId = Number.parseInt(session.user.id as string);

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
      return { status: "error", error: "Message not found" };
    }

    return { status: "success", data: msg.updatedAt };
  } catch (error) {
    console.error("Error editing message in guestbook:", error);
    return { status: "error", error: "Failed to edit message" };
  }
}
