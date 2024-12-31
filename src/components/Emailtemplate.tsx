import Link from "next/link";

export const EmailTemplate = ({
  from_name,
  message,
  sender_email
}: {
  message: string;
  from_name: string;
  sender_email: string;
}) => (
  <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
    <h1 className="mb-4 text-2xl font-bold text-gray-800">New message from {from_name}</h1>
    <p className="mb-2 text-gray-600">{message}</p>
    <p className="text-gray-500">
      Sender email:{" "}
      <Link href={`mailto:${sender_email}`} className="text-blue-500 hover:underline">
        {sender_email}
      </Link>
    </p>
  </div>
);
