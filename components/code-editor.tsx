"use client";

import { useEffect, useRef } from "react";
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: "html" | "css" | "javascript";
  height?: string;
}

export function CodeEditor({ value, onChange, language, height = "500px" }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorInstanceRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const langExtension =
      language === "html"
        ? html()
        : language === "css"
        ? css()
        : javascript();

    const editor = new EditorView({
      doc: value,
      extensions: [
        basicSetup,
        langExtension,
        keymap.of([indentWithTab]),
        vscodeDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
      parent: editorRef.current,
    });

    editorInstanceRef.current = editor;

    return () => {
      editor.destroy();
      editorInstanceRef.current = null;
    };
  }, [language, onChange]);

  useEffect(() => {
    const editor = editorInstanceRef.current;
    if (editor && value !== editor.state.doc.toString()) {
      editor.dispatch({
        changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return <div ref={editorRef} className="overflow-hidden rounded border bg-black" style={{ height }} />;
}