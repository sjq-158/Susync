import StaticHtmlPage from "@/components/StaticHtmlPage";
import MessagesEnhancer from "@/components/MessagesEnhancer";

export default function Page() {
  return (
    <>
      <StaticHtmlPage slug="messages_BUYER" noRoot />
      <MessagesEnhancer />
    </>
  );
}
