"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/lib/types";
import { TaskApp_AuditLog } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Actions } from "./actions";
import { Activity } from "./activity";
import { Description } from "./description";
import { Header } from "./header";

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const {
    data: cardData,
    error: cardError,
    isPending: isCardLoading,
  } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/cards/${id}`),
    enabled: !!id,
  });

  const {
    data: auditLogsData,
    isError,
    isPending: isAuditLogsPending,
    error: auditLogsError,
    refetch: refetchAuditLogs,
  } = useQuery<TaskApp_AuditLog[]>({
    queryKey: ["card-logs", id],
    queryFn: () => fetcher(`/api/cards/${id}/logs`),
    enabled: !!id,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {cardError || auditLogsError ? (
          <div className="flex flex-col gap-2 ">
            <span>Something went wrong. </span>
            <span>{cardError?.message}</span>
            <span>{auditLogsError?.message}</span>
          </div>
        ) : (
          <>
            {isCardLoading && !cardData ? (
              <>
                <Header.Skeleton />
                <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                  <div className="col-span-3">
                    <div className="w-full space-y-6">
                      <Description.Skeleton />
                      <Activity.Skeleton />
                    </div>
                  </div>
                  <Actions.Skeleton />
                </div>
              </>
            ) : (
              <>
                <Header data={cardData} />
                <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                  <div className="col-span-3">
                    <div className="w-full space-y-6">
                      <Description data={cardData} />

                      {isAuditLogsPending && !auditLogsData ? (
                        <Activity.Skeleton />
                      ) : auditLogsError ? (
                        <div>some error fetching logs </div>
                      ) : (
                        <Activity items={auditLogsData} />
                      )}
                    </div>
                  </div>
                  <Actions data={cardData} />
                </div>
              </>
            )}

            {/* {isCardLoading ? <Header.Skeleton /> : <Header data={cardData} />}
            <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
              <div className="col-span-3">
                <div className="w-full space-y-6">
                  {isCardLoading ? (
                    <Description.Skeleton />
                  ) : (
                    <Description data={cardData} />
                  )}
                  {!auditLogsData ? (
                    <Activity.Skeleton />
                  ) : (
                    <Activity items={auditLogsData} />
                  )}
                </div>
              </div>
              {isCardLoading ? (
                <Actions.Skeleton />
              ) : (
                <Actions data={cardData} />
              )}
            </div> */}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
