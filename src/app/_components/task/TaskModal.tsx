import { format } from "date-fns";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaEllipsis,
  FaInbox,
  FaX,
} from "react-icons/fa6";
import TextareaAutosize from "react-textarea-autosize";
import { api } from "~/trpc/react";
import { TaskSummaryType } from "~/trpc/types";

export default function TaskModal({
  taskId,
  dismiss,
}: {
  taskId: string;
  dismiss: () => void;
}) {
  const { data: task } = api.task.read.useQuery(
    {
      id: taskId,
    },
    {
      enabled: !!taskId,
    },
  );

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingNameAndDescription, setEditingNameAndDescription] =
    useState(false);
  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description ?? "");
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {/* Modal backdrop */}
      <div
        onClick={dismiss}
        className="fixed inset-0 z-[1000] bg-black/50"></div>

      {/* Modal Content */}
      <div className="z-[1001] flex h-1/2 w-[800px] flex-col rounded-lg bg-foreground">
        {/* heading */}
        <div className="flex w-full items-center justify-between rounded-t-lg border-b border-white/30 p-2">
          {/* leading */}
          <div>
            <button type="button" className="flex items-center gap-2">
              <FaInbox /> Inbox
            </button>
          </div>

          {/* trailing */}
          <div className="flex items-center gap-2">
            <FaChevronUp />
            <FaChevronDown />
            <FaEllipsis />
            <button type="button" onClick={dismiss}>
              <FaX />
            </button>
          </div>
        </div>

        {/* main content */}
        <div className="flex">
          {/* leading */}
          <div className="flex flex-1 flex-col px-4 pt-2">
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="h-6 w-6 rounded-full border-2 bg-transparent"
              />
              {editingNameAndDescription ? (
                // editable version
                <form className="flex w-full flex-col gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-none bg-transparent p-0 text-white outline-none placeholder:font-bold focus:ring-0"
                    placeholder="Task name..."
                  />
                  <TextareaAutosize
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task description..."
                    className="resize-none border-none bg-transparent p-0 text-white outline-none placeholder:text-sm focus:ring-0"
                    maxRows={8}
                  />
                  <div className="flex w-full justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingNameAndDescription(false)}
                      className="rounded border border-white px-4 py-2 text-white">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded bg-primary px-4 py-2"
                      disabled={!name}>
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                // readonly version
                <div
                  className="flex flex-col"
                  onClick={() => setEditingNameAndDescription(true)}>
                  <div>{task?.name}</div>
                  <div>{task?.description}</div>
                </div>
              )}
            </div>

            {task && <Comments task={task} />}
          </div>

          {/* trailing */}
          <div className="flex w-[200px] flex-col bg-white/20 p-4">
            <p>Project</p>
            <button type="button" className="flex items-center gap-2">
              <FaInbox /> Inbox
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Comments = ({ task }: { task: TaskSummaryType }) => {
  const [isCommentsCollapsed, setIsCommentsCollapsed] = useState(false);
  const utils = api.useUtils();
  const [editingOrAddingComment, setEditingOrAddingComment] = useState(false);
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [comment, setComment] = useState("");
  const { mutate: editOrAddComment } = api.task.addComment.useMutation({
    onSuccess: async () => {
      await utils.task.readAll.invalidate();
      await utils.task.read.invalidate({ id: task.id });
      setEditingOrAddingComment(false);
      setComment("");
    },
  });
  const handleEditOrAddComment = (e: FormEvent) => {
    if (task) {
      e.preventDefault();
      editOrAddComment({ text: comment, taskId: task.id });
    }
  };
  useEffect(() => {
    if (editingOrAddingComment) {
      commentTextareaRef.current?.focus();
    }
  }, [editingOrAddingComment]);
  return (
    <div className="my-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsCommentsCollapsed((prev) => !prev)}>
          <FaChevronDown
            className={`transition ${isCommentsCollapsed ? "-rotate-90" : ""}`}
          />
        </button>
        <h5>Comments</h5>
      </div>
      <hr />
      {!isCommentsCollapsed && (
        <div>
          <div className="my-1 flex flex-col gap-2">
            {task.comments.map((comment) => (
              <div key={comment.id} className="flex flex-col">
                <span className="text-xs">
                  {format(comment.createdAt, "yyyy-MM-dd h:m")}
                </span>

                {comment.text}
              </div>
            ))}
          </div>
          {editingOrAddingComment ? (
            <form
              onSubmit={(e) => handleEditOrAddComment(e)}
              className="mt-2 rounded-lg border p-1">
              <TextareaAutosize
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comment..."
                ref={commentTextareaRef}
                className="resize-none border-none bg-transparent p-0 text-white outline-none placeholder:text-sm focus:ring-0"
                maxRows={8}
              />
              <div className="flex w-full justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOrAddingComment(false)}
                  className="rounded border border-white px-4 py-2 text-white">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-primary px-4 py-2"
                  disabled={!comment}>
                  Comment
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-2 flex w-full gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border">
                F
              </div>
              <button
                type="button"
                onClick={() => setEditingOrAddingComment(true)}
                className="flex w-full rounded-xl border px-2">
                Comment
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
