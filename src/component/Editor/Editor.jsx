// import React, { useEffect, useRef, useState } from "react";
// import JoditEditor from "jodit-react";
// import EditorWrapper from "./EditorWrapper";

// const Editor = ({
//   initialValues = "",
//   onChange,
//   readOnly = false,
//   placeholder = "Start typing here...",
//   className,
// }) => {
//   const editorRef = useRef(null);
//   const [content, setContent] = useState("");

//   // Apply inline table styles
//   const applyTableStyles = (html) => {
//     if (!html) return "";
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, "text/html");

//     doc.querySelectorAll("table").forEach((table) => {
//       table.style.borderCollapse = "collapse";
//       table.style.width = table.style.width || "100%";
//       table.style.border = "1px solid";

//       table.querySelectorAll("td, th").forEach((cell) => {
//         cell.style.border = "1px solid";
//         cell.style.padding = "6px 10px";
//         cell.style.textAlign = cell.style.textAlign || "left";
//       });
//     });

//     return doc.body.innerHTML;
//   };

//   // Initialize editor content
//   useEffect(() => {
//     const styledHtml = applyTableStyles(initialValues);
//     setContent(styledHtml);
//   }, [initialValues]);

//   // Auto-adjust height when read-only mode
//   useEffect(() => {
//     if (readOnly && editorRef.current) {
//       const adjustHeight = () => {
//         try {
//           const editorBody = editorRef.current?.editor?.editor;
//           if (editorBody) {
//             // compute scrollHeight of rendered content
//             const newHeight = Math.min(editorBody.scrollHeight + 20, 2000);
//             editorBody.style.height = `${newHeight}px`;
//           }
//         } catch (e) {
//           console.warn("Auto height failed:", e);
//         }
//       };
//       setTimeout(adjustHeight, 200); // wait a bit for render
//     }
//   }, [content, readOnly]);

//   // Jodit configuration
//   const config = {
//     readonly: readOnly,
//     toolbar: !readOnly,
//     // showCharsCounter: false,
//     // showWordsCounter: false,
//     // showPoweredBy: false,
//     placeholder,
//     toolbarSticky: false,
//     width: "100%",
//     height: "auto",
//     toolbarButtonSize: "medium",
//     showXPathInStatusbar: false,
//     allowResizeY: false,
//     allowResizeX: true,

//     buttons: [
//       "bold",
//       "italic",
//       "underline",
//       "strikethrough",
//       "|",
//       "ul",
//       "ol",
//       "|",
//       "link",
//       "table",
//       "hr",
//       "fullsize"
//     ],
//     removeButtons: [
//       "preview",
//       "print",
//       "spellcheck",
//       "image",
//       "video",
//       "file",
//       "document",
//       "speech",
//       // "fullsize",
//       "dots",
//       "undo",
//       "redo",
//     ],
//     defaultActionOnPaste: "insert_as_html",
//     askBeforePasteHTML: false,
//     enableDragAndDropFileToEditor: true,

//     style: `
//       html, body {
//         font-family: system-ui, sans-serif !important;
//         font-size: 14px !important;
//         color: #000 !important;
//         background: #fff !important;
//         margin: 0 !important;
//         padding: 10px !important;
//         line-height: 1.6 !important;
//       } 

//       ul {
//         list-style-type: disc !important;
//         padding-left: 2em !important;
//         margin: 0 0 1em 0 !important;
//       }

//       ol {
//         list-style-type: decimal !important;
//         padding-left: 2em !important;
//         margin: 0 0 1em 0 !important;
//       }

//       li {
//         margin-bottom: 0.4em !important;
//       }

//       table, th, td {
//         border: 1px solid #000 !important;
//         border-collapse: collapse !important;
//         padding: 6px 10px !important;
//         text-align: left !important;
//       }

//       @media (max-width: 768px) {
//         table, th, td {
//           border: 2px solid #111 !important;
//         }
//       }
//     `,

//     events: {
//       afterInsertTable: function (table) {
//         table.style.borderCollapse = "collapse";
//         table.style.width = "100%";
//         table.style.border = "1px solid #000";
//         table.querySelectorAll("td, th").forEach((cell) => {
//           cell.style.border = "1px solid #000";
//           cell.style.padding = "6px 10px";
//           cell.style.textAlign = "left";
//         });
//       },
//     },
//   };

//   return (
//     <EditorWrapper>
//       <div className="relative">
//         <JoditEditor
//           ref={editorRef}
//           value={content}
//           config={config}
//           tabIndex={1}
//           onBlur={(newContent) => {
//             const styledContent = applyTableStyles(newContent);
//             setContent(styledContent);
//             if (onChange) onChange(styledContent);
//           }}
//           onChange={() => {}}
//           className={className}
//         />

//         {/* Read-only overlay */}
//         {readOnly && (
//           <div className="absolute inset-0 bg-transparent pointer-events-auto cursor-not-allowed" />
//         )}
//       </div>
//     </EditorWrapper>
//   );
// };

// export default Editor;


import React, { useEffect, useRef, useState, useMemo } from "react";
import JoditEditor from "jodit-react";
// import EditorWrapper from "./EditorWrapper"; // Ensure this is styled correctly

const Editor = ({
  value = "", // Ant Design passes 'value'
  onChange,
  readOnly = false,
  placeholder = "Start typing here...",
  className,
}) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState("");

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

  // Sync internal state with external 'value' prop
  useEffect(() => {
    const styledHtml = applyTableStyles(value);
    // Only update if the content is actually different to avoid cursor jumps
    if (styledHtml !== content) {
      setContent(styledHtml);
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
    buttons: [
      "bold", "italic", "underline", "strikethrough", "|",
      "ul", "ol", "|",
      "link", "table", "hr", "fullsize"
    ],
    removeButtons: [
      "preview", "print", "spellcheck", "image", "video", 
      "file", "document", "speech", "dots", "undo", "redo",
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
      } 
      table { border-collapse: collapse; width: 100%; }
      table, td, th { border: 1px solid #000 !important; padding: 8px; }
    `,
    
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
        onChange={() => {}} // Performance optimization: only update on Blur
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