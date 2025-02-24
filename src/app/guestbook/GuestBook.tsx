"use client";

import { motion } from "framer-motion";
import { Loader2, Send, AlertCircle, Edit2 } from "lucide-react";
import Image from "next/image";
import { type Dispatch, type FormEvent, type SetStateAction, useState } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";

import { addMessageToGuestBook, deleteMessageFromGuestBook, editMessageInGuestBook } from "@/actions/guestbook";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MAX_LENGTH_MESSAGE_GUESTBOOK, MAX_NUMBER_MESSAGE_GUESTBOOK_PER_USER } from "@/lib/config";
import { ERRORS } from "@/lib/error";
import { compareTimes } from "@/lib/utils";

import type { GuestbookMessage } from "@/types/guestbook";
import type { Session } from "next-auth";

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
        <div className="absolute bottom-2 right-2 text-sm text-muted-foreground">
          <span className={isOverLimit ? "text-destructive" : ""}>{charactersLeft}</span>
        </div>
      </div>

      {error && (
        <div className="flex items-center rounded-md border border-destructive bg-destructive/10 p-2 text-destructive">
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
      className={`h-10 w-10 overflow-hidden rounded-full border-4 ${
        isCurrentUser ? "border-emerald-400" : "border-transparent"
      }`}
    >
      <Image
        src={image || "/placeholder.svg"}
        alt={name}
        width={40}
        height={40}
        className="h-full w-full rounded-full"
      />
    </div>
  );
}

function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  loading
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-semibold">Confirm Delete</h3>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this message? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RiDeleteBin5Fill className="mr-2 h-4 w-4" />
            )}
            Delete
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
  setMessages
}: {
  message: GuestbookMessage;
  user: Session["user"] | null;
  setEditingMessageId: Dispatch<SetStateAction<number | null>>;
  setEditMessage: Dispatch<SetStateAction<string>>;
  setMessages: Dispatch<SetStateAction<GuestbookMessage[]>>;
}) {
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      if (user) {
        await deleteMessageFromGuestBook(message.id);
        setMessages((prev) => prev.filter((msg) => msg.id !== message.id));
      }
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex gap-2">
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
      <Button variant="ghost" size="icon" onClick={() => setIsDeleteDialogOpen(true)}>
        <RiDeleteBin5Fill className="h-4 w-4" />
      </Button>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
      />
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
  handleEdit
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
}) {
  const isCurrentUser = message.user.id === Number.parseInt(user?.id ?? "");

  return (
    <Card className="group transition-all hover:shadow-md">
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <UserAvatar image={message.user.image} name={message.user.name} isCurrentUser={isCurrentUser} />
            <div>
              <div className="flex">
                <p className={`font-medium ${isCurrentUser ? "underline underline-offset-2" : ""}`}>
                  {message.user.name}
                </p>
                {!compareTimes(message.createdAt, message.updatedAt) && (
                  <span className="ml-1 text-sm text-muted-foreground">(edited)</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
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
          {isCurrentUser && (
            <MessageActions
              message={message}
              user={user}
              setEditingMessageId={setEditingMessageId}
              setEditMessage={setEditMessage}
              setMessages={setMessages}
            />
          )}
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

export default function GuestForm({ messages, user }: { messages: GuestbookMessage[]; user: Session["user"] | null }) {
  const [message, setMessage] = useState("");
  const [guestbookMessages, setGuestbookMessages] = useState<GuestbookMessage[]>(messages);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editMessage, setEditMessage] = useState("");

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
          name: userName
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

  return (
    <>
      {user && (
        <Card className="mb-8">
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
        <h2 className="mb-6 text-3xl font-bold">Messages</h2>
        <div className="space-y-6">
          {guestbookMessages.length > 0 ? (
            guestbookMessages
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((message) => (
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
                />
              ))
          ) : (
            <p className="text-muted-foreground">Be the first to leave a message in my guestbook!</p>
          )}
        </div>
      </>
    </>
  );
}
