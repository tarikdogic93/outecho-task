import { DetailedTopicCard } from "@/features/topics/components/detailed-topic-card";

export default async function page({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const topicId = (await params).topicId;

  return <DetailedTopicCard topicId={topicId} />;
}
