import type { WeeklyUpdate } from '../lib/types'
import { formatPublishedDate, formatWeekOf } from '../lib/utils'

interface Props {
  update: WeeklyUpdate
  showHeader?: boolean
}

export function UpdateRenderer({ update, showHeader = true }: Props) {
  return (
    <article>
      {showHeader && (
        <header className="mb-8 border-b border-slate-200 pb-6">
          <p className="text-sm font-medium text-blue-700 uppercase tracking-wide">Current Update</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            Week of {formatWeekOf(update.weekOf)}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Published {formatPublishedDate(update.publishedAt)}
            {update.publishedBy && ` · ${update.publishedBy}`}
          </p>
        </header>
      )}

      <div className="space-y-8">
        {update.sections.map((section) => (
          <section key={section.id}>
            <h3 className="text-xl font-semibold text-slate-900 border-l-4 border-blue-600 pl-3 mb-4">
              {section.title}
            </h3>
            <div className="space-y-5 ml-1">
              {section.subsections.map((subsection) => (
                <div key={subsection.id}>
                  {subsection.title && (
                    <h4 className="text-base font-semibold text-slate-700 mb-2">
                      {subsection.title}
                    </h4>
                  )}
                  <ul className="space-y-3">
                    {subsection.bullets.map((bullet) => (
                      <li
                        key={bullet.id}
                        className="prose-update text-slate-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: bullet.content }}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}
