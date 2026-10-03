/**
 * CareerForge AI - Sandbox Code Editor
 * Code editor workspace with client-side execution safety & test runner.
 */
import React, { useState } from 'react';
import { Play, RotateCcw, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api.ts';

interface SandboxCodeEditorProps {
  initialCode?: string;
  language?: string;
  onCodeChange?: (code: string) => void;
  className?: string;
}

export const SandboxCodeEditor: React.FC<SandboxCodeEditorProps> = ({
  initialCode = '// Write your code solution here\nfunction solution() {\n  return true;\n}\n\nconsole.log("Result:", solution());',
  language = 'javascript',
  onCodeChange,
  className = '',
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (onCodeChange) onCodeChange(newCode);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setHasError(false);
    setOutput(null);

    try {
      const res = await api.runCode({ code, language });
      if (res.success) {
        setOutput(res.output);
      } else {
        setHasError(true);
        setOutput(res.output || res.error || 'Execution encountered an error.');
      }
    } catch (err) {
      setHasError(true);
      setOutput((err as Error).message || 'Execution error.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput(null);
    setHasError(false);
    if (onCodeChange) onCodeChange(initialCode);
  };

  return (
    <div className={`flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-slate-950 ${className}`}>
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-mono font-medium text-slate-300">Solution Sandbox ({language})</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-all shadow-md shadow-emerald-900/30"
          >
            <Play className="w-3 h-3 fill-current" />
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Code Textarea */}
      <div className="relative font-mono text-xs">
        <textarea
          value={code}
          onChange={e => handleCodeChange(e.target.value)}
          rows={10}
          spellCheck={false}
          className="w-full bg-slate-950 text-slate-200 p-4 font-mono text-xs leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="// Type your code solution..."
        />
      </div>

      {/* Terminal Output Drawer */}
      {output !== null && (
        <div className="border-t border-slate-800 bg-slate-900/90 p-3.5 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            {hasError ? (
              <span className="flex items-center gap-1 text-rose-400">
                <AlertCircle className="w-3.5 h-3.5" /> Execution Result (Error)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Execution Result (Success)
              </span>
            )}
          </div>
          <pre className="text-slate-200 whitespace-pre-wrap overflow-x-auto bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
};
