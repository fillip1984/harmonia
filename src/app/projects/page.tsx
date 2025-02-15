"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaEllipsis,
  FaInbox,
  FaPencil,
  FaPlus,
  FaTrash,
  FaX,
} from "react-icons/fa6";
import { PiDotsSixVerticalLight } from "react-icons/pi";
import TextareaAutosize from "react-textarea-autosize";
import { api } from "~/trpc/react";
import { ProjectSummaryType } from "~/trpc/types";

export default function Project() {
  const { data: projects } = api.project.readAll.useQuery();

  //removal/delete
  const utils = api.useUtils();
  const { mutate: removeProject } = api.project.delete.useMutation({
    onSuccess: async () => {
      await utils.project.invalidate();
    },
  });
  const handleRemoveProject = (id: string) => {
    removeProject({ id });
  };

  // modal
  const [projectForEditInModal, setProjectForEditInModal] =
    useState<ProjectSummaryType>();

  return (
    <div className="container mx-auto mt-12 flex max-w-[800px] flex-1 flex-col overflow-hidden">
      <h4 className="font-bold">Projects</h4>
      <div className="flex flex-col gap-2">
        {projects?.map((project) => (
          <ProjectRow
            key={project.id}
            project={project}
            setProjectForEditInModal={setProjectForEditInModal}
            handleRemoveProject={handleRemoveProject}
          />
        ))}
        <button
          type="button"
          onClick={() =>
            setProjectForEditInModal({
              id: "new",
              name: "",
              description: "",
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          }
          className="flex items-center gap-2">
          <FaPlus className="text-primary" /> Add project
        </button>
      </div>

      <div className="mt-2">
        {projectForEditInModal && (
          <ProjectModal
            projectId={projectForEditInModal.id}
            dismiss={() => setProjectForEditInModal(undefined)}
          />
        )}
      </div>
    </div>
  );
}

const ProjectRow = ({
  project,
  setProjectForEditInModal,
  handleRemoveProject,
}: {
  project: ProjectSummaryType;
  setProjectForEditInModal: (project: ProjectSummaryType) => void;
  handleRemoveProject: (id: string) => void;
}) => {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group mt-2 flex gap-2 border-b border-gray p-2">
      {/* <PiDotsSixVerticalLight className="dragHandle cursor-grab" /> */}
      {/* <input
        type="checkbox"
        className="h-6 w-6 rounded-full border-2 bg-transparent"
      /> */}
      <div className="flex flex-col">
        <span>{project.name}</span>
        <span className="text-sm text-gray">{project.description}</span>
      </div>
      <div className="ml-auto hidden gap-2 group-hover:flex">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setProjectForEditInModal(project);
          }}>
          <FaPencil className="text-primary" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleRemoveProject(project.id);
          }}>
          <FaTrash className="text-danger" />
        </button>
      </div>
    </Link>
  );
};

const ProjectModal = ({
  projectId,
  dismiss,
}: {
  projectId: string;
  dismiss: () => void;
}) => {
  const { data: project } = api.project.read.useQuery(
    {
      id: projectId,
    },
    {
      enabled: !!projectId,
    },
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description ?? "");
    }
  }, [project]);

  const utils = api.useUtils();
  const { mutate: addProject } = api.project.create.useMutation({
    onSuccess: async () => {
      await utils.project.readAll.invalidate();
      await utils.project.read.invalidate({ id: projectId });
      dismiss();
    },
  });
  const { mutate: updateProject } = api.project.update.useMutation({
    onSuccess: async () => {
      await utils.project.readAll.invalidate();
      await utils.project.read.invalidate({ id: projectId });
      dismiss();
    },
  });
  const handleProjectSave = (e: FormEvent) => {
    e.preventDefault();
    if (projectId === "new") {
      addProject({ name, description });
    } else {
      updateProject({ id: projectId, name, description });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {/* Modal backdrop */}
      <div
        onClick={dismiss}
        className="fixed inset-0 z-[1000] bg-black/50"></div>

      {/* Modal Content */}
      <div className="z-[1001] flex h-1/2 w-[400px] flex-col rounded-lg bg-foreground">
        {/* heading */}
        <div className="flex w-full items-center justify-between rounded-t-lg border-b border-white/30 p-2">
          {/* leading */}
          <div>Add project</div>

          {/* trailing */}
          <div className="flex items-center gap-2">
            <button type="button" onClick={dismiss}>
              <FaX />
            </button>
          </div>
        </div>

        {/* main content */}
        <div className="flex flex-1">
          <form
            id="project-form"
            onSubmit={handleProjectSave}
            className="flex w-full flex-col gap-2 p-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-none bg-transparent p-0 text-white outline-none placeholder:font-bold focus:ring-0"
              placeholder="Project name..."
            />
            <TextareaAutosize
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description..."
              className="resize-none border-none bg-transparent p-0 text-white outline-none placeholder:text-sm focus:ring-0"
              maxRows={8}
            />
          </form>
        </div>

        {/* footer */}
        <div className="flex w-full justify-end gap-2 p-2">
          <button
            type="button"
            onClick={dismiss}
            className="rounded border border-white px-4 py-2 text-white">
            Cancel
          </button>
          <button
            type="submit"
            form="project-form"
            className="rounded bg-primary px-4 py-2"
            disabled={!name}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
