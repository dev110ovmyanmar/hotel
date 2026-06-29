import React, { useEffect, useRef, useState, useMemo } from "react";
import JoditEditor from "jodit-react";
// import EditorWrapper from "./EditorWrapper"; // Ensure this is styled correctly 

const Editor = ({
  value, // Ant Design passes 'value'
  onChange,
  readOnly = false,
  placeholder = "Start typing here...",
  className,
}) => {
  const editorRef = useRef(null);

  // Apply inline table styles to ensure HTML output contains necessary CSS
  const applyTableStyles = (html) => {
    if (!html) return "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    doc.querySelectorAll("table").forEach((table) => {
      table.style.borderCollapse = "collapse";
      table.style.width = table.style.width || "100%";
      table.style.border = "1px solid #000";

      table.querySelectorAll("td, th").forEach((cell) => {
        cell.style.border = "1px solid #000";
        cell.style.padding = "6px 10px";
        cell.style.textAlign = cell.style.textAlign || "left";
      });
    });

    return doc.body.innerHTML;
  };

  const [content, setContent] = useState(() => applyTableStyles(value));

  // Sync internal state with external 'value' prop
  useEffect(() => {
    const styledHtml = applyTableStyles(value);
    // Only update if the content is actually different to avoid cursor jumps
    if (styledHtml !== content) {
      setContent(styledHtml);
      if (editorRef.current && typeof editorRef.current.value !== 'undefined') {
        editorRef.current.value = styledHtml;
      }
    }
  }, [value]);

  // Auto-adjust height when read-only mode
  useEffect(() => {
    if (readOnly && editorRef.current) {
      const adjustHeight = () => {
        try {
          const editorBody = editorRef.current?.editor?.editor;
          if (editorBody) {
            const newHeight = Math.min(editorBody.scrollHeight + 20, 2000);
            editorBody.style.height = `${newHeight}px`;
          }
        } catch (e) {
          console.warn("Auto height failed:", e);
        }
      };
      setTimeout(adjustHeight, 200);
    }
  }, [content, readOnly]);

  // Configuration Memoized to prevent unnecessary re-renders
  const config = useMemo(() => ({
    theme: "default",
    readonly: readOnly,
    toolbar: !readOnly,
    placeholder,
    toolbarSticky: false,
    width: "100%",
    height: "auto",
    toolbarButtonSize: "medium",
    showXPathInStatusbar: false,
    allowResizeY: false,
    allowResizeX: false,
    // 1. Remove "link" from this array
    buttons: [
      "bold", "italic", "underline", "strikethrough", "|",
      "ul", "ol", "|",
      "table", "hr", "fullsize"
    ],
    // 2. Add the specific keys to removeButtons
    removeButtons: [
      "preview", "print", "spellcheck", "image", "video",
      "file", "document", "speech", "dots", "undo", "redo",
      "omega", "brush", "paragraph" // "omega" is symbols, "brush" is color/fill
    ],
    defaultActionOnPaste: "insert_as_html",
    askBeforePasteHTML: false,

    // Custom styling for the editor iframe
    style: `
      html, body {
        font-family: system-ui, sans-serif !important;
        font-size: 14px !important;
        line-height: 1.6 !important;
        padding: 10px !important;
        color: #000 !important;
        background-color: #fff !important;
      } 
      table { border-collapse: collapse; width: 100%; }
      table, td, th { border: 1px solid #000 !important; padding: 8px; }
    `
    ,

    events: {
      afterInsertTable: function (table) {
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";
        table.style.border = "1px solid #000";
        table.querySelectorAll("td, th").forEach((cell) => {
          cell.style.border = "1px solid #000";
          cell.style.padding = "6px 10px";
        });
      },
    },
  }), [readOnly, placeholder]);

  return (
    <div className={`relative ${className}`}>
      <style>{`
        .jodit-wysiwyg {
          color: #000 !important;
          background-color: #fff !important;
        }
        .jodit-wysiwyg * {
          color: #000 !important;
        }
      `}</style>
      <JoditEditor
        ref={editorRef}
        value={content}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => {
          const styledContent = applyTableStyles(newContent);
          setContent(styledContent);
          if (onChange) onChange(styledContent);
        }}
        onChange={() => { }} // Performance optimization: only update on Blur
      />

      {/* Transparent overlay to strictly prevent interaction in read-only mode */}
      {readOnly && (
        <div
          className="absolute inset-0 bg-transparent z-10 cursor-not-allowed"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
};

export default Editor;