import { marked } from 'marked'
import { formatWeekOf, newId } from './week-utils.mjs'

marked.setOptions({ gfm: true, breaks: false })

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) {
    return { meta: {}, body: text }
  }
  const meta = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    meta[key] = value
  }
  return { meta, body: text.slice(match[0].length) }
}

function markdownToHtml(markdown) {
  const trimmed = markdown.trim()
  if (!trimmed) return '<p></p>'
  const html = marked.parse(trimmed, { async: false })
  return html.trim().replace(/\n/g, '')
}

function isStructuralLine(line) {
  const trimmed = line.trim()
  return (
    trimmed.startsWith('# ') ||
    trimmed.startsWith('## ') ||
    /^[-*]\s+/.test(trimmed)
  )
}

function parseBullets(lines, startIndex) {
  const bullets = []
  let i = startIndex

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i += 1
      continue
    }

    if (trimmed.startsWith('#')) break
    if (!/^[-*]\s+/.test(trimmed)) break

    const bulletLines = [trimmed.replace(/^[-*]\s+/, '')]
    i += 1

    while (i < lines.length) {
      const next = lines[i]
      const nextTrimmed = next.trim()
      if (!nextTrimmed) {
        i += 1
        break
      }
      if (isStructuralLine(next) && !/^\s+[-*]\s+/.test(next)) break
      if (/^\s+[-*]\s+/.test(next)) {
        bulletLines.push(next.trimEnd())
        i += 1
        continue
      }
      if (/^\s+/.test(next)) {
        bulletLines[bulletLines.length - 1] += ` ${nextTrimmed}`
        i += 1
        continue
      }
      break
    }

    const markdown = bulletLines
      .map((part, index) => (index === 0 ? part : part.replace(/^\s*[-*]\s+/, '- ')))
      .join('\n')

    bullets.push({
      id: newId(),
      content: markdownToHtml(markdown),
    })
  }

  return { bullets, nextIndex: i }
}

export function parseMarkdownWeek(markdown) {
  const { meta, body } = parseFrontmatter(markdown)
  const weekOf = meta['week-of']
  if (!weekOf || !/^\d{4}-\d{2}-\d{2}$/.test(weekOf)) {
    throw new Error('Frontmatter must include week-of: YYYY-MM-DD')
  }

  const lines = body.split(/\r?\n/)
  const sections = []
  let currentSection = null
  let currentSubsection = null
  let i = 0

  function ensureSection(title) {
    currentSection = { id: newId(), title, subsections: [] }
    sections.push(currentSection)
    currentSubsection = null
  }

  function ensureSubsection(title = '') {
    if (!currentSection) {
      throw new Error('Content found before the first # section heading')
    }
    currentSubsection = { id: newId(), title, bullets: [] }
    currentSection.subsections.push(currentSubsection)
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i += 1
      continue
    }

    if (trimmed.startsWith('## ')) {
      ensureSubsection(trimmed.slice(3).trim())
      i += 1
      continue
    }

    if (trimmed.startsWith('# ')) {
      ensureSection(trimmed.slice(2).trim())
      i += 1
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      if (!currentSection) {
        throw new Error('Bullets must appear under a # section heading')
      }
      if (!currentSubsection) {
        ensureSubsection('')
      }
      const { bullets, nextIndex } = parseBullets(lines, i)
      currentSubsection.bullets.push(...bullets)
      i = nextIndex
      continue
    }

    throw new Error(`Unexpected line ${i + 1}: ${trimmed}`)
  }

  if (sections.length === 0) {
    throw new Error('Add at least one # section heading')
  }

  for (const section of sections) {
    if (section.subsections.length === 0) {
      section.subsections.push({ id: newId(), title: '', bullets: [] })
    }
  }

  const publishedBy = meta['published-by'] || 'mwesolowski@axon.com'

  return {
    id: weekOf,
    weekOf,
    title: 'Axon Weekly Update',
    publishedAt: new Date().toISOString(),
    publishedBy,
    sections,
  }
}

export function htmlToMarkdown(html) {
  let text = html.trim()

  text = text.replace(/<\/p>\s*<p>/gi, '\n\n')
  text = text.replace(/<p>/gi, '')
  text = text.replace(/<\/p>/gi, '\n')
  text = text.replace(/<strong>/gi, '**')
  text = text.replace(/<\/strong>/gi, '**')
  text = text.replace(/<em>/gi, '*')
  text = text.replace(/<\/em>/gi, '*')
  text = text.replace(/<ul>\s*/gi, '\n')
  text = text.replace(/<\/ul>\s*/gi, '\n')
  text = text.replace(/<li>/gi, '- ')
  text = text.replace(/<\/li>/gi, '\n')
  text = text.replace(/<br\s*\/?>/gi, '\n')
  text = text.replace(/<[^>]+>/g, '')
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/&lt;/g, '<')
  text = text.replace(/&gt;/g, '>')
  text = text.replace(/\n{3,}/g, '\n\n')

  return text.trim()
}

function formatBulletMarkdown(html) {
  const md = htmlToMarkdown(html)
  return md
    .split('\n')
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed) return ''
      if (trimmed.startsWith('- ')) return trimmed
      return `- ${trimmed}`
    })
    .filter(Boolean)
}

export function updateToMarkdown(update) {
  const lines = [
    '---',
    `week-of: ${update.weekOf}`,
    `published-by: ${update.publishedBy || 'mwesolowski@axon.com'}`,
    '---',
    '',
  ]

  for (const section of update.sections) {
    lines.push(`# ${section.title}`, '')

    for (const subsection of section.subsections) {
      if (subsection.title) {
        lines.push(`## ${subsection.title}`, '')
      }

      for (const bullet of subsection.bullets) {
        const bulletLines = formatBulletMarkdown(bullet.content)
        for (const bulletLine of bulletLines) {
          if (bulletLine.startsWith('- ')) {
            lines.push(
              bulletLines.length > 1 && bulletLine !== bulletLines[0]
                ? `  ${bulletLine}`
                : bulletLine,
            )
          } else {
            lines.push(`- ${bulletLine}`)
          }
        }
        lines.push('')
      }
    }
  }

  return `${lines.join('\n').trimEnd()}\n`
}
