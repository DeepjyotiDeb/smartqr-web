import { renderToString } from 'katex';

/** Splits input into text / inlineMath / displayMath parts */
type Part =
  | { type: 'text'; text: string }
  | { type: 'inlineMath'; tex: string }
  | { type: 'displayMath'; tex: string };

export function parseMathParts(input: string): Part[] {
  const parts: Part[] = [];
  let i = 0;
  while (i < input.length) {
    if (input.startsWith('$$', i)) {
      const end = input.indexOf('$$', i + 2);
      if (end > i + 2) {
        parts.push({
          type: 'displayMath',
          tex: input.slice(i + 2, end),
        });
        i = end + 2;
        continue;
      }
    }
    if (input[i] === '$') {
      const end = input.indexOf('$', i + 1);
      if (end > i + 1) {
        parts.push({ type: 'inlineMath', tex: input.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    const nextDisp = input.indexOf('$$', i);
    const nextInl = input.indexOf('$', i);
    const next =
      nextDisp === -1 ? nextInl : nextInl === -1 ? nextDisp : Math.min(nextDisp, nextInl);
    if (next === -1) {
      parts.push({ type: 'text', text: input.slice(i) });
      break;
    } else {
      parts.push({ type: 'text', text: input.slice(i, next) });
      i = next;
    }
  }
  return parts.filter((p) => (p.type === 'text' ? p.text.trim() !== '' : true));
}

export function renderMathContentToHtml(content: string): string {
  return parseMathParts(content)
    .map((part) =>
      part.type === 'text'
        ? `<span>${part.text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')}</span>`
        : renderToString(part.tex, {
            displayMode: part.type === 'inlineMath',
            throwOnError: false,
            output: 'html',
          })
    )
    .join('');
}
