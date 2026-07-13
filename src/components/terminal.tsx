'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { resumeData } from '@/lib/data';
import { asciiBanner } from '@/lib/terminal-data';

type Line = {
  id?: number;
  content: React.ReactNode;
  isCommand?: boolean;
};

function formatProjects() {
  return resumeData.projects.map((p, i) => (
    <div key={i} className="mb-5">
      <div className="text-green-300 font-bold">{`> ${p.title}`}</div>
      <div className="text-green-500/70 ml-4 text-xs leading-relaxed">{p.location}</div>
      <div className="text-green-400/90 ml-4 leading-relaxed">{p.role}</div>
      <div className="text-green-500/60 ml-4 text-xs leading-relaxed">{p.date}</div>
      {p.points.map((pt, j) => (
        <div key={j} className="text-green-300/70 ml-8 mt-1 leading-relaxed">- {pt}</div>
      ))}
    </div>
  ));
}

function renderExperience() {
  return resumeData.experience.map((e, i) => (
    <div key={i} className="mb-4">
      <div className="text-green-300 font-bold">{e.title}</div>
      <div className="text-green-400/90 ml-4 leading-relaxed">{e.role}</div>
      <div className="text-green-500/60 ml-4 text-xs leading-relaxed">{e.date}</div>
      <div className="text-green-500/60 ml-4 text-xs leading-relaxed">{e.location}</div>
      {e.points.map((pt, j) => (
        <div key={j} className="text-green-300/60 ml-8 mt-1 leading-relaxed">- {pt}</div>
      ))}
    </div>
  ));
}

function renderSkills() {
  return (
    <div className="space-y-1.5">
      {resumeData.skillsAndHonors.map((s, i) => (
        <div key={i} className="leading-relaxed">{s}</div>
      ))}
    </div>
  );
}

function renderEducation() {
  const e = resumeData.education;
  return (
    <div className="space-y-1.5">
      <div className="text-green-300 font-bold">{e.school}</div>
      <div className="text-green-400/80 leading-relaxed">{e.location}</div>
      <div className="text-green-400/80 leading-relaxed">{e.graduation}</div>
      {e.notables && <div className="text-green-300/60 mt-2 leading-relaxed">{e.notables}</div>}
    </div>
  );
}

export function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { content: asciiBanner, isCommand: false },
    { content: <span className="text-green-500/60">Welcome. Type <span className="text-green-300 font-bold">help</span> for available commands.</span>, isCommand: false },
    { content: '', isCommand: false },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(100);
  const [scrollKey, setScrollKey] = useState(0);

  const commands = {
    help: {
      desc: 'Show available commands',
      fn: () => (
        <div className="leading-relaxed">
          {commandsText.map(([cmd, desc]) => (
            <div key={cmd}>
              <span className="text-green-400">{cmd.padEnd(14)}</span>{desc}
            </div>
          ))}
        </div>
      ),
    },
    whoami: {
      desc: 'Display user information',
      fn: () => (
        <div className="space-y-0.5">
          <div>name: <span className="text-green-300 font-bold">Bhavesh Adivi</span></div>
          <div>role: <span className="text-green-300">High School Sophomore @ TJHSST</span></div>
          <div>focus: <span className="text-green-300">Computational Biomedicine / AI / Engineering</span></div>
        </div>
      ),
    },
    about: {
      desc: 'About me',
      fn: () => <div className="text-green-300/90 leading-relaxed">{resumeData.summary}</div>,
    },
    education: {
      desc: 'Education background',
      fn: () => renderEducation(),
    },
    projects: {
      desc: 'List research & projects',
      fn: () => formatProjects(),
    },
    experience: {
      desc: 'Work & volunteer experience',
      fn: () => renderExperience(),
    },
    skills: {
      desc: 'Skills & honors',
      fn: () => renderSkills(),
    },
    contact: {
      desc: 'Contact information',
      fn: () => (
        <div className="space-y-0.5">
          <div>email:  2028badivi@tjhsst.edu</div>
          <div>github: github.com/2028badivi</div>
          <div>linkedin: linkedin.com/in/bhavesh-adivi</div>
        </div>
      ),
    },
    banner: {
      desc: 'Show ASCII banner',
      fn: () => asciiBanner,
    },
    clear: {
      desc: 'Clear the terminal',
      fn: () => null,
    },
    ls: {
      desc: 'List directories',
      fn: () => <span>projects  experience  education  skills  contact</span>,
    },
    pwd: {
      desc: 'Show current path',
      fn: () => <span className="text-green-500/60">~/terminal</span>,
    },
    date: {
      desc: 'Show current date & time',
      fn: () => <span>{new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short' })} EST</span>,
    },
  };

  const commandsText: [string, string][] = Object.entries(commands).map(([cmd, val]) => [cmd, val.desc]);

  const addLine = useCallback((content: React.ReactNode, isCommand = false) => {
    setScrollKey(k => k + 1);
    setLines(prev => [...prev, { content, isCommand, id: nextId.current++ }]);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [scrollKey]);

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    addLine(`$ ${trimmed}`, true);

    if (trimmed.toLowerCase() === 'clear') {
      setLines([{ content: asciiBanner, isCommand: false, id: nextId.current++ }]);
      return;
    }

    const parts = trimmed.split(/\s+/);
    const baseCmd = parts[0].toLowerCase();

    if (baseCmd in commands) {
      const result = commands[baseCmd as keyof typeof commands].fn();
      if (result) addLine(result);
    } else {
      addLine(<span>command not found: {baseCmd}. Try help.</span>);
    }
  }, [addLine]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setHistory(prev => [...prev, input.trim()]);
    setHistoryIdx(-1);
    processCommand(input.trim());
    setInput('');
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const newIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(newIdx);
      setInput(history[newIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) {
        setInput('');
        return;
      }
      const newIdx = historyIdx + 1;
      if (newIdx >= history.length) {
        setHistoryIdx(-1);
        setInput('');
        return;
      }
      setHistoryIdx(newIdx);
      setInput(history[newIdx]);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        const idx = selectedSuggestion >= 0 ? selectedSuggestion : 0;
        setInput(suggestions[idx]);
        setSuggestions([]);
        setSelectedSuggestion(-1);
      } else {
        const partial = input.trim().toLowerCase();
        if (!partial) return;
        const matches = Object.keys(commands).filter(c => c.startsWith(partial));
        if (matches.length === 1) {
          setInput(matches[0]);
        } else if (matches.length > 1) {
          setSuggestions(matches);
          setSelectedSuggestion(-1);
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    const val = e.target.value.trim().toLowerCase();
    if (val) {
      setSuggestions(Object.keys(commands).filter(c => c.startsWith(val) && c !== val));
    } else {
      setSuggestions([]);
    }
    setSelectedSuggestion(-1);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="flex-1 flex flex-col bg-black"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal output */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto py-4 px-2 md:px-3 space-y-1"
      >
        {lines.map((line, i) => (
          <div key={line.id || i} className="whitespace-pre-wrap break-words leading-relaxed text-sm">
            {line.content}
          </div>
        ))}
      </div>

      {/* Suggestion bar */}
      {suggestions.length > 0 && (
        <div className="shrink-0 px-3 py-1 text-xs text-green-500/60 flex gap-4">
          {suggestions.map((s, i) => (
            <span key={s} className={`cursor-pointer ${i === selectedSuggestion ? 'text-green-300' : ''}`}>{s}</span>
          ))}
        </div>
      )}

      {/* Input line */}
      <form onSubmit={handleSubmit} className="flex shrink-0 items-center gap-0 px-2 md:px-3 py-2">
        <span className="text-green-400 shrink-0">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => inputRef.current?.focus(), 10)}
          className="flex-1 bg-transparent border-none outline-none text-green-300 ml-2 font-mono text-sm"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </form>
    </div>
  );
}