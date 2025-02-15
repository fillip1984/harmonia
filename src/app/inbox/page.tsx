"use client";

import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { PiDotsSixVerticalLight } from "react-icons/pi";
import TextareaAutosize from "react-textarea-autosize";
import { api } from "~/trpc/react";
import { TaskSummaryType } from "~/trpc/types";
import TaskModal from "../_components/TaskModal";

export default function Inbox() {
  const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);
  const handleShowAddTask = () => {
    setIsAddTaskVisible(true);
  };

  const { data: tasks } = api.task.readAll.useQuery();
  const utils = api.useUtils();
  const { mutate: removeTask } = api.task.delete.useMutation({
    onSuccess: async () => {
      await utils.task.invalidate();
    },
  });
  const handleRemoveTask = (id: string) => {
    removeTask({ id });
  };

  // modal
  const [taskForEditInModal, setTaskForEditInModal] =
    useState<TaskSummaryType>();

  // DND
  const [parentRef, draggableTasks, setValues] = useDragAndDrop<
    HTMLDivElement,
    TaskSummaryType
  >([], {
    dragHandle: ".dragHandle",
    onDragend: (e) => {
      console.log({ e });
    },
  });

  useEffect(() => {
    if (tasks) {
      setValues(tasks);
    }
  }, [tasks]);

  return (
    <div className="container mx-auto mt-12 flex max-w-[800px] flex-1 flex-col overflow-hidden">
      <h4>Inbox</h4>
      <div ref={parentRef} className="flex flex-col gap-2">
        {draggableTasks?.map((task) => (
          <div
            key={task.id}
            onClick={() => setTaskForEditInModal(task)}
            className="group mt-2 flex cursor-pointer gap-2 border-b border-gray p-2">
            <PiDotsSixVerticalLight className="dragHandle cursor-grab" />
            <input
              type="checkbox"
              className="bg-transparent h-6 w-6 rounded-full border-2"
            />
            <div className="flex flex-col">
              <span>{task.name}</span>
              <span className="text-sm text-gray">{task.description}</span>
            </div>
            <div className="ml-auto hidden group-hover:block">
              <button type="button" onClick={() => handleRemoveTask(task.id)}>
                <FaTrash className="text-danger" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2">
        {!isAddTaskVisible && (
          <button
            type="button"
            onClick={handleShowAddTask}
            className="flex items-center gap-2">
            <FaPlus className="text-primary" /> Add task
          </button>
        )}

        {isAddTaskVisible && (
          <AddTask dismiss={() => setIsAddTaskVisible(false)} />
        )}

        {taskForEditInModal && (
          <TaskModal
            taskId={taskForEditInModal.id}
            dismiss={() => setTaskForEditInModal(undefined)}
          />
        )}
      </div>
    </div>
  );
}

const AddTask = ({ dismiss }: { dismiss: () => void }) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const utils = api.useUtils();
  const { mutate: addTask } = api.task.create.useMutation({
    onSuccess: async () => {
      await utils.task.invalidate();
      setName("");
      setDescription("");
      nameRef.current?.focus();
    },
  });
  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    addTask({ name, description });
  };

  useEffect(() => {
    // ux - focus on name when made visible
    nameRef.current?.focus();
  }, []);

  return (
    <form
      onSubmit={(e) => handleAddTask(e)}
      className="rounded border border-gray p-2">
      <div className="flex flex-col">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          ref={nameRef}
          className="bg-transparent border-none p-0 text-white outline-none placeholder:font-bold focus:ring-0"
          placeholder="Task name..."
        />
        <TextareaAutosize
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description..."
          className="bg-transparent resize-none border-none p-0 text-white outline-none placeholder:text-sm focus:ring-0"
          maxRows={8}
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={dismiss}
          className="rounded border border-white px-4 py-2 text-white">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded bg-primary px-4 py-2"
          disabled={!name}>
          Add task
        </button>
      </div>
    </form>
  );
};
