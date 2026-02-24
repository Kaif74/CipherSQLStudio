import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Terminal } from 'lucide-react';
import './SqlEditor.scss';

const SqlEditor = ({ value, onChange }) => {
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    return (
        <div className="sql-editor-container">
            <div className="editor-header">
                <Terminal size={16} className="icon" />
                <h3>SQL Query Editor</h3>
            </div>
            <div className="editor-wrapper">
                <Editor
                    height="100%"
                    defaultLanguage="sql"
                    theme="vs-dark" // Could be made dynamic based on app theme
                    value={value}
                    onChange={(val) => onChange(val || '')}
                    onMount={handleEditorDidMount}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: 'on',
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 16, bottom: 16 },
                        fontFamily: "'Fira Code', 'Roboto Mono', monospace",
                    }}
                />
            </div>
        </div>
    );
};

export default SqlEditor;
