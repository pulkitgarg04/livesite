"use client"

import { useEffect, useState } from "react"
import { basicSetup } from "codemirror"
import { EditorView, keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"
import { javascript } from "@codemirror/lang-javascript"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: "html" | "css" | "javascript"
  height?: string
}

export function CodeEditor({ value, onChange, language, height = "500px" }: CodeEditorProps) {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [editor, setEditor] = useState<EditorView | null>(null)

  useEffect(() => {
    if (!element) return

    if (editor) {
      editor.destroy()
    }

    let langExtension
    switch (language) {
      case "html":
        langExtension = html()
        break
      case "css":
        langExtension = css()
        break
      case "javascript":
        langExtension = javascript()
        break
      default:
        langExtension = javascript()
    }

    const view = new EditorView({
      doc: value,
      extensions: [
        basicSetup,
        langExtension,
        keymap.of([indentWithTab]),
        vscodeDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString())
          }
        }),
      ],
      parent: element,
    })

    setEditor(view)

    return () => {
      view.destroy()
    }
  }, [element, language])

  useEffect(() => {
    if (editor && value !== editor.state.doc.toString()) {
      editor.dispatch({
        changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: value,
        },
      })
    }
  }, [value, editor])

  return <div ref={setElement} className="overflow-hidden rounded border bg-black" style={{ height }} />
}
