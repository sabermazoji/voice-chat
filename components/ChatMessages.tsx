import { Message } from "ai";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  error: string;
}

export function ChatMessages({
  messages,
  isLoading,
  error,
}: ChatMessagesProps) {
  return (
    <div className="space-y-4" aria-live="polite">
      {messages.length
        ? messages?.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg p-2 w-2/4 space-y-5 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="text-sm">
                  <b className="mr-1">
                    {message.role === "user" ? "You:" : "AI:"}
                  </b>
                  {message.data?.toString()}
                </p>
                <audio
                  src={message.content}
                  controls
                  className="w-full h-9"
                  aria-label={
                    message.role === "user" ? "User audio" : "AI response audio"
                  }
                  autoPlay={message.role === "user" ? false : true}
                />
                <span
                  className={`text-xs  ${
                    message.role === "user"
                      ? "text-primary-foreground"
                      : "text-secondary-foreground"
                  }`}
                >
                  {message.createdAt?.toLocaleString()}
                </span>
              </div>
            </div>
          ))
        : "Let's talks"}
      {isLoading && (
        <div className="text-center">
          <span className="animate-pulse">Processing your message...</span>
        </div>
      )}
      {error && (
        <div className="text-center">
          <b className=" text-red-800">Something is wrong:</b>
          <span className="animate-pulse text-red-800">{error}</span>
        </div>
      )}
    </div>
  );
}
