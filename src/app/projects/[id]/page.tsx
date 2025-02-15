"use client";

import React, { use, useState } from "react";
import LoadingAndRetry from "~/app/_components/nav/LoadingAndRetry";
import TaskList from "~/app/_components/TaskList";
import { api } from "~/trpc/react";

export default function page({ params }: { params: Promise<{ id: string }> }) {
  const paramsResolved = use(params);
  const {
    data: project,
    isLoading,
    isError,
    refetch: retry,
  } = api.project.read.useQuery(
    {
      id: paramsResolved.id,
    },
    { enabled: !!paramsResolved.id },
  );
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
