"use client";

import { Loader2, FileCode, FilePlus, FileEdit, Eye, Trash2, FolderInput } from "lucide-react";

export interface ToolInvocationArgs {
  command?: string;
  path?: string;
  new_path?: string;
}

export interface ToolInvocation {
  toolName: string;
  state: "partial" | "call" | "result" | string;
  result?: unknown;
  args?: ToolInvocationArgs;
}

interface ToolInvocationBadgeProps {
  toolInvocation: ToolInvocation;
}

export interface ToolDisplayInfo {
  icon: React.ReactNode;
  message: string;
}

export function getToolDisplayInfo(toolInvocation: ToolInvocation): ToolDisplayInfo {
  const { toolName, args } = toolInvocation;
  const command = args?.command;
  const path = args?.path || "file";
  const fileName = path.split("/").pop() || path;

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return {
          icon: <FilePlus className="w-3.5 h-3.5" />,
          message: `Creating ${fileName}`,
        };
      case "str_replace":
      case "insert":
        return {
          icon: <FileEdit className="w-3.5 h-3.5" />,
          message: `Editing ${fileName}`,
        };
      case "view":
        return {
          icon: <Eye className="w-3.5 h-3.5" />,
          message: `Reading ${fileName}`,
        };
      default:
        return {
          icon: <FileCode className="w-3.5 h-3.5" />,
          message: `Processing ${fileName}`,
        };
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename":
        const newFileName = args?.new_path?.split("/").pop() || "file";
        return {
          icon: <FolderInput className="w-3.5 h-3.5" />,
          message: `Renaming ${fileName} → ${newFileName}`,
        };
      case "delete":
        return {
          icon: <Trash2 className="w-3.5 h-3.5" />,
          message: `Deleting ${fileName}`,
        };
      default:
        return {
          icon: <FileCode className="w-3.5 h-3.5" />,
          message: `Managing ${fileName}`,
        };
    }
  }

  // Fallback for unknown tools
  return {
    icon: <FileCode className="w-3.5 h-3.5" />,
    message: toolName,
  };
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const isComplete = toolInvocation.state === "result" && toolInvocation.result;
  const { icon, message } = getToolDisplayInfo(toolInvocation);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
          <span className="text-neutral-600">{icon}</span>
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" />
          <span className="text-neutral-600">{icon}</span>
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}
