import { TaskApp_Card, TaskApp_List } from "@prisma/client";

export type ListWithCards = TaskApp_List & { cards: TaskApp_Card[] };

export type CardWithList = TaskApp_Card & { list: TaskApp_List };
