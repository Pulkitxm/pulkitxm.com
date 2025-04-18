import { getGuestBookMessages } from "@/actions/guestbook";
import { auth } from "@/lib/authOptions";
import { GuestbookMessage, validateGuestbookMessageArray } from "@/types/guestbook";

import LogoutButton, { LoginButtons } from "./AuthButton";
import GuestBook from "./GuestBook";

export default async function GuestbookPage() {
  const session = await auth();
  const messages: GuestbookMessage[] = [];

  try {
    const dbMessages = await getGuestBookMessages();
    if (dbMessages.status === "error")
      return (
        <div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Error loading messages</h1>
          <p className="mt-3 text-lg text-gray-400">Please try again later.</p>
        </div>
      );

    const validateMessages = validateGuestbookMessageArray.safeParse(dbMessages.data);
    if (validateMessages.success) messages.push(...validateMessages.data);
    else console.error(validateMessages.error.issues);
  } catch (e) {
    console.error(e);
  }

  return (
    <main className="py-12">
      <div className="text-center">
        {session ? (
          <>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Hi {session.user?.name}, thanks for stopping by!
            </h1>
            <p className="mt-3 text-lg text-gray-400">Feel free to leave a message in my guestbook.</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Hi there, would you like to sign my guestbook?
            </h1>
            <p className="mt-3 text-lg text-gray-400">Sign in to leave a message and let me know you were here!</p>
          </>
        )}
      </div>

      {!session ? (
        <>
          <LoginButtons />
          <GuestBook messages={messages} user={null} />
        </>
      ) : (
        <div className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={session.user?.image || "/api/placeholder/32/32"}
                alt={session.user?.name || "Avatar"}
                className="h-8 w-8 rounded-full"
                width={32}
                height={32}
              />
              <span className="font-medium text-white">{session.user?.name}</span>
            </div>
            <LogoutButton />
          </div>

          <GuestBook messages={messages} user={session.user} />

          <div className="mt-8 space-y-6">{/* Guestbook entries would go here */}</div>
        </div>
      )}
    </main>
  );
}
