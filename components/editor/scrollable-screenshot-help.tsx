"use client"

import type { ReactElement, ReactNode } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, MonitorSmartphone } from "lucide-react"

const SNIPPET = `import { captureRef } from 'react-native-view-shot';
import { useRef } from 'react';
import { ScrollView, View } from 'react-native';

function MyScreen() {
  const scrollContentRef = useRef();

  const captureFullScreen = async () => {
    try {
      const uri = await captureRef(scrollContentRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      console.log('Screenshot completo salvato in:', uri);
    } catch (error) {
      console.error('Errore durante la cattura:', error);
    }
  };

  return (
    <ScrollView>
      <View ref={scrollContentRef} collapsable={false}>
        {/* il contenuto della tua schermata */}
      </View>
    </ScrollView>
  );
}`

const KEYWORDS = new Set([
  "import", "from", "function", "const", "return", "try", "catch", "async", "await",
])

// Lightweight, dependency-free syntax highlighter tuned for this one JS/JSX
// snippet — tokenizes strings, comments, JSX tags, keywords, and punctuation.
function highlight(code: string) {
  const tokenRe =
    /(\/\*[\s\S]*?\*\/|\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(<\/?[A-Za-z][\w.]*|\/?>)|(\b(?:import|from|function|const|return|try|catch|async|await)\b)|([{}()[\];,.])/gm

  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = tokenRe.exec(code)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<span key={key++}>{code.slice(lastIndex, match.index)}</span>)
    }
    const [full, comment, string, jsx, keyword, punct] = match
    if (comment) {
      nodes.push(
        <span key={key++} className="text-muted-foreground/70 italic">
          {comment}
        </span>
      )
    } else if (string) {
      nodes.push(
        <span key={key++} className="text-[oklch(0.60_0.20_145)]">
          {string}
        </span>
      )
    } else if (jsx) {
      nodes.push(
        <span key={key++} className="text-primary font-medium">
          {jsx}
        </span>
      )
    } else if (keyword) {
      nodes.push(
        <span key={key++} className="text-[oklch(0.65_0.22_35)] font-medium">
          {keyword}
        </span>
      )
    } else if (punct) {
      nodes.push(<span key={key++} className="text-muted-foreground/60">{punct}</span>)
    } else {
      nodes.push(<span key={key++}>{full}</span>)
    }
    lastIndex = match.index + full.length
  }
  if (lastIndex < code.length) {
    nodes.push(<span key={key++}>{code.slice(lastIndex)}</span>)
  }
  return nodes
}

export function ScrollableScreenshotHelp({ children }: { children: ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger render={children as ReactElement} />
      <PopoverContent align="end" className="w-[420px] p-0 overflow-hidden">
        <div className="flex items-start gap-2.5 px-4 pt-4 pb-3">
          <div className="flex items-center justify-center size-7 rounded-md bg-primary/10 text-primary shrink-0">
            <MonitorSmartphone className="size-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground leading-tight">Got a scrollable screen?</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              If your screen has content that scrolls (a feed, a long list), don&apos;t just screenshot what&apos;s
              visible — capture the whole thing. Here&apos;s a quick snippet using react-native-view-shot to grab
              the full height:
            </p>
          </div>
        </div>

        <pre className="max-h-72 overflow-auto bg-[oklch(0.1_0_0)] px-4 py-3 text-[11px] leading-relaxed">
          <code className="font-mono whitespace-pre text-foreground/90 [html:not(.dark)_&]:text-[oklch(0.92_0_0)]">
            {highlight(SNIPPET)}
          </code>
        </pre>

        <div className="p-4 pt-3">
          <Alert className="border-primary/20 bg-primary/5 py-2.5">
            <AlertTriangle className="size-3.5 text-primary" />
            <AlertDescription className="text-[11px] leading-relaxed text-foreground/80">
              Attach the ref to the content <code className="font-mono text-[10.5px]">View</code> inside the{" "}
              <code className="font-mono text-[10.5px]">ScrollView</code>, not the{" "}
              <code className="font-mono text-[10.5px]">ScrollView</code> itself — otherwise you&apos;ll only capture
              what&apos;s visible on screen.{" "}
              <code className="font-mono text-[10.5px]">{"collapsable={false}"}</code>{" "}
              is required on Android to prevent the view from being optimized away.
            </AlertDescription>
          </Alert>
        </div>
      </PopoverContent>
    </Popover>
  )
}
