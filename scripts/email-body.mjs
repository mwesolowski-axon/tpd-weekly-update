import { formatWeekOf } from './week-utils.mjs'

function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<\/li>\s*<li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const LINK_LABEL = 'Axon Weekly Update Archive'

function updateUrl(siteUrl, updateId) {
  return `${siteUrl.replace(/\/$/, '')}/update/${updateId}`
}

export function buildEmailSubject(template, weekOf) {
  return template.replace(/\{weekOf\}/g, formatWeekOf(weekOf))
}

export function updateToEmailHtml(update, siteUrl) {
  const weekLabel = formatWeekOf(update.weekOf)
  const link = updateUrl(siteUrl, update.id)
  const title = update.title || 'Axon Weekly Update'

  const sectionsHtml = update.sections
    .map((section) => {
      const subsectionsHtml = section.subsections
        .map((subsection) => {
          const titleHtml = subsection.title
            ? `<h4 style="margin:16px 0 8px;font-size:16px;font-weight:600;color:#334155;">${subsection.title}</h4>`
            : ''
          const bulletsHtml = subsection.bullets
            .map(
              (bullet) =>
                `<li style="margin-bottom:12px;color:#334155;line-height:1.5;">${bullet.content}</li>`,
            )
            .join('')
          return `${titleHtml}<ul style="margin:0 0 16px;padding-left:24px;">${bulletsHtml}</ul>`
        })
        .join('')

      return `<h3 style="margin:24px 0 12px;font-size:20px;font-weight:600;color:#0f172a;border-left:4px solid #2563eb;padding-left:12px;">${section.title}</h3>${subsectionsHtml}`
    })
    .join('')

  return `<div style="font-family:Segoe UI,Arial,sans-serif;font-size:14px;color:#334155;">
<h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0f172a;">${title}</h2>
<p style="margin:0 0 4px;font-size:16px;color:#334155;">Week of ${weekLabel}</p>
${sectionsHtml}
<p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e2e8f0;">View online: <a href="${link}">${LINK_LABEL}</a></p>
</div>`
}

export function updateToEmailPlainText(update, siteUrl) {
  const weekLabel = formatWeekOf(update.weekOf)
  const link = updateUrl(siteUrl, update.id)
  const title = update.title || 'Axon Weekly Update'
  const lines = [title, `Week of ${weekLabel}`, '']

  for (const section of update.sections) {
    lines.push(section.title, '')
    for (const subsection of section.subsections) {
      if (subsection.title) {
        lines.push(subsection.title)
      }
      for (const bullet of subsection.bullets) {
        const text = stripHtml(bullet.content)
        for (const part of text.split('\n')) {
          const trimmed = part.trim()
          if (trimmed) lines.push(`- ${trimmed}`)
        }
        lines.push('')
      }
    }
    lines.push('')
  }

  lines.push(`View online: ${LINK_LABEL} (${link})`)
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}
