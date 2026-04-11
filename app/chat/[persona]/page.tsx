import { notFound } from "next/navigation";
import ChatShell from "@/components/chat-shell";
import { personas, type PersonaId } from "@/lib/personas";

type PageProps = {
  params: Promise<{ persona: string }>;
};

export default async function ChatPage({ params }: PageProps) {
  const { persona } = await params;
  if (!(persona in personas)) {
    notFound();
  }

  const config = personas[persona as PersonaId];

  return (
    <ChatShell
      personaId={config.id}
      personaName={config.name}
      personaDescription={config.description}
      personaPlaceholder={config.placeholder}
      exampleQuestions={config.exampleQuestions}
      readmeUrl={config.readmeUrl}
      wikiUrl={config.wikiUrl}
    />
  );
}
