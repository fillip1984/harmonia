"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { ProjectDetailType } from "~/trpc/types";
import TaskList from "../_components/TaskList";
import LoadingAndRetry from "../_components/nav/LoadingAndRetry";

export default function Inbox() {
  const {
    data: inboxTasks,
    isLoading,
    isError,
    refetch: retry,
  } = api.task.readInbox.useQuery();
  const [project, setProject] = useState<ProjectDetailType>();
  useEffect(() => {
    setProject({
      id: "inbox",
      name: "Inbox",
      description: "Tasks without a project",
      tasks: inboxTasks ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }, [inboxTasks]);

  return (
    <div className="container mx-auto mt-12 flex max-w-[800px] flex-1 flex-col overflow-hidden">
      {!project && (
        <LoadingAndRetry
          isLoading={isLoading}
          isError={isError}
          retry={retry}
        />
      )}
      {project && <TaskList project={project} />}
    </div>
  );
}
