import { MyTopicsList } from "@/features/topics/components/my-topics-list";

export function TopicsContent() {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-y-10">
      <h1 className="text-3xl font-semibold">
        Explore <span className="text-primary">your</span> topics
      </h1>
      <MyTopicsList />
    </div>
  );
}
