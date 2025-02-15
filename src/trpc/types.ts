import { RouterOutputs } from "./react";

export type ProjectSummaryType = RouterOutputs["project"]["readAll"][number];
export type ProjectDetailType = Exclude<RouterOutputs["project"]["read"], null>;
export type TaskSummaryType = RouterOutputs["task"]["readAll"][number];
