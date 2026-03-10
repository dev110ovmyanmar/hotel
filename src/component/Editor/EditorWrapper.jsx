import React from "react";

const EditorWrapper = ({ children, rtl }) => {
  return (
    <div className="w-full relative" data-rtl={rtl ? "rtl" : "ltr"}>
      {children}

      <style>{`
        /*  Base editor styling */
        .jodit-wysiwyg {
          min-height: 220px;
          font-family: system-ui, sans-serif !important;
          font-size: 14px !important;
          color: #000 !important; /* <-- Default text color black */
          background: #fff !important;
          line-height: 1.6 !important;
        }

        /*  Tables: always visible borders */
        .jodit-wysiwyg table,
        .jodit-wysiwyg th,
        .jodit-wysiwyg td {
          border: 1px solid #000 !important;
          border-collapse: collapse !important;
          padding: 6px 10px !important;
          text-align: left;
        }

        /*  Lists */
        .jodit-wysiwyg ul {
          list-style-type: disc !important;
          margin-left: 1.5em !important;
        }
        .jodit-wysiwyg ol {
          list-style-type: decimal !important;
          margin-left: 1.5em !important;
        }
        .jodit-wysiwyg li {
          margin-bottom: 0.4em;
        }

        /*  Hide UL/OL dropdown arrows */
        .jodit-toolbar-button.jodit-toolbar-list__unorderedList .jodit_toolbar_drop,
        .jodit-toolbar-button.jodit-toolbar-list__orderedList .jodit_toolbar_drop {
          display: none !important;
        }

        /*  Optional: focus highlight for cells */
        .jodit-wysiwyg td:focus {
          outline: 2px solid #1e40af;
        }

        /*  Mobile: darker borders */
        @media (max-width: 768px) {
          .jodit-wysiwyg table,
          .jodit-wysiwyg th,
          .jodit-wysiwyg td {
            border: 2px solid #111 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EditorWrapper;


