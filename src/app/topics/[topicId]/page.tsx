import { DetailedTopicCardWithComments } from "@/features/topics/components/detailed-topic-card-with-comments";

export default async function page({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const topicId = (await params).topicId;

  return <DetailedTopicCardWithComments topicId={topicId} />;
}
