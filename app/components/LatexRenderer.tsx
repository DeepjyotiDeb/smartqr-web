import { useEffect, useRef } from 'react';
import katex from 'katex';

interface LatexRendererProps {
    content: string;
    className?: string;
}

export function LatexRenderer({ content, className = '' }: LatexRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Split content by LaTeX delimiters ($$...$$)
        const parts = content.split(/(\$\$.*?\$\$)/g);

        // Clear container
        containerRef.current.innerHTML = '';

        parts.forEach((part) => {
            if (part.startsWith('$$') && part.endsWith('$$')) {
                // LaTeX content
                const latex = part.slice(2, -2);
                const span = document.createElement('span');
                try {
                    katex.render(latex, span, {
                        displayMode: false,
                        throwOnError: false,
                        errorColor: '#cc0000',
                    });
                } catch (err) {
                    span.textContent = part; // Fallback to raw text on error
                }
                containerRef.current?.appendChild(span);
            } else if (part) {
                // Regular text
                const textNode = document.createTextNode(part);
                containerRef.current?.appendChild(textNode);
            }
        });
    }, [content]);

    return <div ref={containerRef} className={className} />;
}