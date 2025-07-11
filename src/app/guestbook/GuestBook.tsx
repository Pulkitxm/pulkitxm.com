"use client";

import { motion } from "framer-motion";
import { Loader2, Send, AlertCircle, Edit2 } from "lucide-react";
import { type Dispatch, type FormEvent, type SetStateAction, useEffect, useMemo, useState } from "react";
import { FaBan } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";

import {
  addMessageToGuestBook,
  deleteMessageFromGuestBook,
  editMessageInGuestBook,
  toggleBlockGuestBookUser
} from "@/actions/guestbook";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MAX_LENGTH_MESSAGE_GUESTBOOK, MAX_NUMBER_MESSAGE_GUESTBOOK_PER_USER } from "@/lib/config";
import { ERRORS } from "@/lib/error";
import { compareTimes } from "@/lib/utils";

import type { GuestbookMessage } from "@/types/guestbook";
import type { Session } from "next-auth";

type DialogType = "delete" | "block" | null;

type DialogState = {
  type: DialogType;
  messageId: number | null;
  userName?: string;
};

function ActionDialog({
  isOpen,
  onClose,
  onConfirm,
  loading,
  type,
  userName
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  type: DialogType;
  userName?: string;
}) {
  if (!isOpen) return null;

  const dialogContent = {
    delete: {
      title: "Confirm Delete",
      message: "Are you sure you want to delete this message? This action cannot be undone.",
      icon: RiDeleteBin5Fill,
      buttonText: "Delete"
    },
    block: {
      title: "Block User",
      message: `Are you sure you want to block ${userName}? This user will no longer be able to interact with the guestbook.`,
      icon: FaBan,
      buttonText: "Block User"
    }
  }[type as "delete" | "block"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md dark:bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="border-border w-full max-w-md rounded-xl border bg-white/95 p-6 shadow-2xl dark:bg-neutral-900/95"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-foreground mb-4 text-lg font-semibold">{dialogContent.title}</h3>
        <p className="text-muted-foreground mb-6">{dialogContent.message}</p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="hover:bg-muted dark:hover:bg-neutral-800"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90 dark:bg-red-700 dark:hover:bg-red-800"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <dialogContent.icon className="mr-2 h-4 w-4" />
            )}
            {dialogContent.buttonText}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MessageActions({
  message,
  user,
  setEditingMessageId,
  setEditMessage,
  canUserEdit,
  canUserDelete,
  canUserBlock,
  setDialogState
}: {
  message: GuestbookMessage;
  user: Session["user"] | null;
  setEditingMessageId: Dispatch<SetStateAction<number | null>>;
  setEditMessage: Dispatch<SetStateAction<string>>;
  setMessages: Dispatch<SetStateAction<GuestbookMessage[]>>;
  canUserEdit: boolean;
  canUserDelete: boolean;
  canUserBlock: boolean;
  setDialogState: Dispatch<SetStateAction<DialogState>>;
}) {
  return (
    <div className="flex gap-2">
      {canUserEdit && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setEditingMessageId(message.id);
            setEditMessage(message.content);
          }}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      )}
      {canUserDelete && (
        <Button variant="ghost" size="icon" onClick={() => setDialogState({ type: "delete", messageId: message.id })}>
          <RiDeleteBin5Fill className="h-4 w-4" />
        </Button>
      )}
      {canUserBlock && user && message.user.id !== Number(user.id) && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDialogState({ type: "block", messageId: message.id, userName: message.user.name })}
        >
          <FaBan className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

function MessageForm({
  message,
  setMessage,
  isSubmitting,
  error,
  handleSubmit
}: {
  message: string;
  setMessage: (message: string) => void;
  isSubmitting: boolean;
  error: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  const charactersLeft = MAX_LENGTH_MESSAGE_GUESTBOOK - message.length;
  const isOverLimit = charactersLeft < 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message..."
          className="min-h-[100px]"
          disabled={isSubmitting}
          maxLength={MAX_LENGTH_MESSAGE_GUESTBOOK}
          required
        />
        <div className="text-muted-foreground absolute right-2 bottom-2 text-sm">
          <span className={isOverLimit ? "text-destructive" : ""}>{charactersLeft}</span>
        </div>
      </div>

      {error && (
        <div className="border-destructive bg-destructive/10 text-destructive flex items-center rounded-md border p-2">
          <AlertCircle className="mr-2 h-4 w-4" />
          {error}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting || isOverLimit} className="w-full">
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        Sign Guestbook
      </Button>
    </form>
  );
}

function UserAvatar({ image, name, isCurrentUser }: { image: string; name: string; isCurrentUser: boolean }) {
  return (
    <div
      className={`h-10 w-10 overflow-hidden rounded-full border-4 ${isCurrentUser ? "border-emerald-400" : "border-transparent"}`}
    >
      <img src={image || "/placeholder.svg"} alt={name} width={40} height={40} className="h-full w-full rounded-full" />
    </div>
  );
}

function MessageCard({
  message,
  user,
  isSubmitting,
  editingMessageId,
  editMessage,
  setEditingMessageId,
  setEditMessage,
  setMessages,
  handleEdit,
  setDialogState
}: {
  message: GuestbookMessage;
  user: Session["user"] | null;
  isSubmitting: boolean;
  editingMessageId: number | null;
  editMessage: string;
  setEditingMessageId: Dispatch<SetStateAction<number | null>>;
  setEditMessage: Dispatch<SetStateAction<string>>;
  setMessages: Dispatch<SetStateAction<GuestbookMessage[]>>;
  handleEdit: (messageId: number) => Promise<void>;
  setDialogState: Dispatch<SetStateAction<DialogState>>;
}) {
  const isCurrentUser = message.user.id === Number.parseInt(user?.id ?? "");

  return (
    <Card className="group bg-background transition-all hover:shadow-md">
      <CardContent className="py-3">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <UserAvatar image={message.user.image} name={message.user.name} isCurrentUser={isCurrentUser} />
            <div>
              <div className="flex">
                <p className={`font-medium ${isCurrentUser ? "underline underline-offset-2" : ""}`}>
                  {message.user.name}
                </p>
                {!compareTimes(message.createdAt, message.updatedAt) && (
                  <span className="text-muted-foreground ml-1 text-sm">(edited)</span>
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                {new Date(message.updatedAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false
                })}
              </p>
            </div>
          </div>
          <MessageActions
            message={message}
            user={user}
            setEditingMessageId={setEditingMessageId}
            setEditMessage={setEditMessage}
            setMessages={setMessages}
            canUserEdit={isCurrentUser}
            canUserDelete={isCurrentUser || (user?.isAdmin ?? false)}
            canUserBlock={user?.isAdmin ?? false}
            setDialogState={setDialogState}
          />
        </div>
        {editingMessageId === message.id ? (
          <div className="space-y-2">
            <Textarea
              value={editMessage}
              onChange={(e) => setEditMessage(e.target.value)}
              className="min-h-[100px]"
              maxLength={MAX_LENGTH_MESSAGE_GUESTBOOK}
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setEditingMessageId(null);
                  setEditMessage("");
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={() => handleEdit(message.id)} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </CardContent>
    </Card>
  );
}

function UserImages({ guestbookMessagesInOrder }: { guestbookMessagesInOrder: GuestbookMessage[] }) {
  const [imagesToShow, setImagesToShow] = useState(10);

  const randomizeArray = useMemo(
    () => [...guestbookMessagesInOrder].sort(() => Math.random() - 0.5),
    [guestbookMessagesInOrder]
  );

  useEffect(() => {
    const updateImageCount = () => {
      if (window.innerWidth < 640) {
        setImagesToShow(3);
      } else if (window.innerWidth < 768) {
        setImagesToShow(5);
      } else if (window.innerWidth < 1024) {
        setImagesToShow(7);
      } else {
        setImagesToShow(10);
      }
    };

    updateImageCount();

    window.addEventListener("resize", updateImageCount);

    return () => window.removeEventListener("resize", updateImageCount);
  }, []);

  return (
    <div className="flex">
      {randomizeArray.length > 0 &&
        randomizeArray.slice(0, imagesToShow).map((guest, index) => (
          <img
            key={guest.id}
            src={guest.user.image}
            alt={guest.user.name}
            width={40}
            height={40}
            className={
              "border-background dark:border-input/30 relative h-8 w-8 rounded-full border-2 sm:h-9 sm:w-9 md:h-10 md:w-10"
            }
            style={{
              marginLeft: index > 0 ? "-13px" : "0",
              zIndex: 10 - index
            }}
          />
        ))}
      {guestbookMessagesInOrder.length > imagesToShow && (
        <div
          className={
            "bg-muted text-muted-foreground relative flex h-8 w-8 items-center justify-center rounded-full font-medium sm:h-9 sm:w-9 md:h-10 md:w-10"
          }
          style={{ marginLeft: "-13px", zIndex: 0 }}
        >
          <span className="text-xs sm:text-sm">+{guestbookMessagesInOrder.length - imagesToShow}</span>
        </div>
      )}
    </div>
  );
}

export default function GuestForm({ messages, user }: { messages: GuestbookMessage[]; user: Session["user"] | null }) {
  const [message, setMessage] = useState("");
  const [guestbookMessages, setGuestbookMessages] = useState<GuestbookMessage[]>(messages);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [dialogState, setDialogState] = useState<DialogState>({ type: null, messageId: null });

  const userName = user?.name as string;
  const userImage = user?.image as string;
  const userId = Number.parseInt(user?.id as string);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const userMessages = guestbookMessages.filter((msg) => msg.user.id === userId);

      if (userMessages.length >= MAX_NUMBER_MESSAGE_GUESTBOOK_PER_USER) {
        setError(ERRORS.MAX_NUMBER_MESSAGE_GUESTBOOK_PER_USER);
        return;
      }

      const res = await addMessageToGuestBook({
        content: message.trim(),
        user: {
          id: userId,
          image: userImage,
          name: userName,
          isBlocked: false
        }
      });

      if (res.status === "success") {
        setGuestbookMessages((prev) => [res.data, ...prev]);
        setMessage("");
      } else {
        setError(res.error || "Failed to post message");
      }
    } catch (err) {
      if (err) setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEdit(messageId: number) {
    setIsSubmitting(true);
    setError("");

    try {
      const res = await editMessageInGuestBook(messageId, editMessage.trim());

      if (res.status === "success") {
        setGuestbookMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, content: editMessage.trim(), updatedAt: res.data } : msg))
        );
        setEditingMessageId(null);
        setEditMessage("");
      } else {
        setError(res.error || "Failed to edit message");
      }
    } catch (err) {
      if (err) setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDialogAction() {
    if (!dialogState.messageId) return;

    setIsSubmitting(true);
    try {
      if (dialogState.type === "delete") {
        const res = await deleteMessageFromGuestBook(dialogState.messageId);
        if (res.status === "success") {
          setGuestbookMessages((prev) => prev.filter((msg) => msg.id !== dialogState.messageId));
        }
      } else if (dialogState.type === "block") {
        const res = await toggleBlockGuestBookUser(dialogState.messageId);
        if (res.status === "success") {
          if (res.data.isBlocked) setGuestbookMessages((prev) => prev.filter((msg) => msg.user.id !== res.data.userId));
        }
      }
    } catch (err) {
      if (err) setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
      setDialogState({ type: null, messageId: null });
    }
  }

  const guestbookMessagesInOrder = useMemo(
    () =>
      guestbookMessages
        .filter((msg) => msg.user.id === userId)
        .concat(
          guestbookMessages
            .filter((msg) => msg.user.id !== userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        ),
    [guestbookMessages, userId]
  );

  return (
    <>
      {user && (
        <Card className="bg-background mb-8">
          <CardHeader>
            <CardTitle>Sign the Guestbook</CardTitle>
          </CardHeader>
          <CardContent>
            <MessageForm
              message={message}
              setMessage={setMessage}
              isSubmitting={isSubmitting}
              error={error}
              handleSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      )}

      <hr className="my-8" />

      <>
        <div className="flex gap-2">
          <h2 className="mb-6 text-3xl font-bold">Messages</h2>
          <UserImages guestbookMessagesInOrder={guestbookMessagesInOrder} />
        </div>
        <div className="space-y-6">
          {guestbookMessages.length > 0 ? (
            guestbookMessagesInOrder.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                user={user}
                isSubmitting={isSubmitting}
                editingMessageId={editingMessageId}
                editMessage={editMessage}
                setEditingMessageId={setEditingMessageId}
                setEditMessage={setEditMessage}
                setMessages={setGuestbookMessages}
                handleEdit={handleEdit}
                setDialogState={setDialogState}
              />
            ))
          ) : (
            <p className="text-muted-foreground">Be the first to leave a message in my guestbook!</p>
          )}
        </div>
      </>

      <ActionDialog
        isOpen={dialogState.type !== null}
        onClose={() => setDialogState({ type: null, messageId: null })}
        onConfirm={handleDialogAction}
        loading={isSubmitting}
        type={dialogState.type}
        userName={dialogState.userName}
      />
    </>
  );
}
