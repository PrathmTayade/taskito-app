import { ActivityList } from "@/components/activity/activity-list";
import { Separator } from "@/components/ui/separator";
import React, { Suspense } from "react";

const ActivityPage = () => {
  return (
    <div className="w-full">
      {/* <Info isPro={isPro} /> */}
      <Separator className="my-2" />
      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  );
};

export default ActivityPage;
