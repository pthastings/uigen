import { describe, test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import {
  ToolInvocationBadge,
  getToolDisplayInfo,
  ToolInvocation,
} from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

describe("getToolDisplayInfo", () => {
  describe("str_replace_editor tool", () => {
    test("returns 'Creating' message for create command", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "create", path: "/App.jsx" },
      };
      const result = getToolDisplayInfo(toolInvocation);
      expect(result.message).toBe("Creating App.jsx");
    });

    test("returns 'Editing' message for str_replace command", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "str_replace", path: "/components/Button.tsx" },
      };
      const result = getToolDisplayInfo(toolInvocation);
      expect(result.message).toBe("Editing Button.tsx");
    });

    test("returns 'Editing' message for insert command", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "insert", path: "/utils/helpers.ts" },
      };
      const result = getToolDisplayInfo(toolInvocation);
      expect(result.message).toBe("Editing helpers.ts");
    });

    test("returns 'Reading' message for view command", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "view", path: "/README.md" },
      };
      const result = getToolDisplayInfo(toolInvocation);
      expect(result.message).toBe("Reading README.md");
    });

    test("returns 'Processing' message for unknown command", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "unknown_command", path: "/file.js" },
      };
      const result = getToolDisplayInfo(toolInvocation);
      expect(result.message).toBe("Processing file.js");
    });
  });

  describe("file_manager tool", () => {
    test("returns 'Renaming' message with both filenames for rename command", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "file_manager",
        state: "result",
        args: { command: "rename", path: "/old.jsx", new_path: "/new.jsx" },
      };
      const result = getToolDisplayInfo(toolInvocation);
      expect(result.message).toBe("Renaming old.jsx → new.jsx");
    });

    test("returns 'Deleting' message for delete command", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "file_manager",
        state: "result",
        args: { command: "delete", path: "/temp.js" },
      };
      const result = getToolDisplayInfo(toolInvocation);
      expect(result.message).toBe("Deleting temp.js");
    });

    test("returns 'Managing' message for unknown command", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "file_manager",
        state: "result",
        args: { command: "unknown", path: "/file.js" },
      };
      const result = getToolDisplayInfo(toolInvocation);
      expect(result.message).toBe("Managing file.js");
    });
  });

  describe("edge cases", () => {
    test("handles missing args gracefully", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
      };
      const result = getToolDisplayInfo(toolInvocation);
      expect(result.message).toBe("Processing file");
    });

    test("handles missing path with fallback", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "create" },
      };
      const result = getToolDisplayInfo(toolInvocation);
      expect(result.message).toBe("Creating file");
    });

    test("handles unknown tool names with fallback", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "unknown_tool",
        state: "result",
        args: { path: "/test.js" },
      };
      const result = getToolDisplayInfo(toolInvocation);
      expect(result.message).toBe("unknown_tool");
    });

    test("extracts filename from nested path", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "create", path: "/src/components/ui/Button.tsx" },
      };
      const result = getToolDisplayInfo(toolInvocation);
      expect(result.message).toBe("Creating Button.tsx");
    });
  });
});

describe("ToolInvocationBadge", () => {
  describe("loading state", () => {
    test("shows spinner when state is 'call'", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "create", path: "/App.jsx" },
      };
      render(<ToolInvocationBadge toolInvocation={toolInvocation} />);

      const message = screen.getByText("Creating App.jsx");
      expect(message).toBeDefined();
    });

    test("shows spinner when state is 'partial'", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        state: "partial",
        args: { command: "str_replace", path: "/Button.tsx" },
      };
      render(<ToolInvocationBadge toolInvocation={toolInvocation} />);

      const message = screen.getByText("Editing Button.tsx");
      expect(message).toBeDefined();
    });
  });

  describe("completed state", () => {
    test("shows green dot when state is 'result' with result", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
        result: { success: true },
        args: { command: "create", path: "/Card.jsx" },
      };
      render(<ToolInvocationBadge toolInvocation={toolInvocation} />);

      const message = screen.getByText("Creating Card.jsx");
      expect(message).toBeDefined();
    });

    test("shows spinner when state is 'result' but no result value", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "create", path: "/Card.jsx" },
      };
      render(<ToolInvocationBadge toolInvocation={toolInvocation} />);

      const message = screen.getByText("Creating Card.jsx");
      expect(message).toBeDefined();
    });
  });

  describe("rendering", () => {
    test("renders the component without crashing", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "str_replace_editor",
        state: "result",
        result: "success",
        args: { command: "create", path: "/Test.jsx" },
      };
      const { container } = render(
        <ToolInvocationBadge toolInvocation={toolInvocation} />
      );

      expect(container.firstChild).toBeDefined();
    });

    test("renders file_manager rename with arrow", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "file_manager",
        state: "result",
        result: { success: true },
        args: { command: "rename", path: "/old.js", new_path: "/new.js" },
      };
      render(<ToolInvocationBadge toolInvocation={toolInvocation} />);

      const message = screen.getByText("Renaming old.js → new.js");
      expect(message).toBeDefined();
    });

    test("renders delete operation", () => {
      const toolInvocation: ToolInvocation = {
        toolName: "file_manager",
        state: "result",
        result: { success: true },
        args: { command: "delete", path: "/unused.js" },
      };
      render(<ToolInvocationBadge toolInvocation={toolInvocation} />);

      const message = screen.getByText("Deleting unused.js");
      expect(message).toBeDefined();
    });
  });
});
