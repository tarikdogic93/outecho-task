import { TopicContent } from "@/components/contents/topic-content";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const topicId = (await params).topicId;

  return <TopicContent topicId={topicId} />;
}
