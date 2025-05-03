'use client';

import React, { useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';

interface CodeEditorProps {
  language: 'html' | 'css' | 'javascript';
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange }) => {
  const getLanguageExtension = () => {
    switch (language) {
      case 'html':
        return [html()];
      case 'css':
        return [css()];
      case 'javascript':
        return [javascript()];
      default:
        return [];
    }
  };

  const getBorderClass = () => {
    switch (language) {
      case 'html':
        return 'border-t-4 border-rose-500';
      case 'css':
        return 'border-t-4 border-blue-500';
      case 'javascript':
        return 'border-t-4 border-yellow-500';
      default:
        return '';
    }
  };

  return (
    <div className={`rounded-lg overflow-hidden ${getBorderClass()} shadow-lg`}>
      <CodeMirror
        value={value}
        height="400px"
        extensions={getLanguageExtension()}
        theme={dracula}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          tabSize: 2,
          foldGutter: true,
        }}
        className="text-sm"
      />
    </div>
  );
};

export default CodeEditor;