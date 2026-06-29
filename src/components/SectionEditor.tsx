import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { WeeklyUpdate, Section, Subsection } from '../lib/types'
import { RichTextEditor } from './RichTextEditor'
import { emptyBullet, emptySection, emptySubsection } from '../lib/utils'

interface Props {
  update: WeeklyUpdate
  onChange: (update: WeeklyUpdate) => void
}

function SortableItem({
  id,
  children,
}: {
  id: string
  children: (props: { dragHandleProps: React.HTMLAttributes<HTMLElement> }) => React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  return (
    <div ref={setNodeRef} style={style}>
      {children({ dragHandleProps: { ...attributes, ...listeners } })}
    </div>
  )
}

export function SectionEditor({ update, onChange }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const setSections = (sections: Section[]) => onChange({ ...update, sections })

  const updateSection = (sectionId: string, patch: Partial<Section>) => {
    setSections(
      update.sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)),
    )
  }

  const updateSubsection = (sectionId: string, subsectionId: string, patch: Partial<Subsection>) => {
    setSections(
      update.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              subsections: s.subsections.map((ss) =>
                ss.id === subsectionId ? { ...ss, ...patch } : ss,
              ),
            }
          : s,
      ),
    )
  }

  const updateBullet = (
    sectionId: string,
    subsectionId: string,
    bulletId: string,
    content: string,
  ) => {
    setSections(
      update.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              subsections: s.subsections.map((ss) =>
                ss.id === subsectionId
                  ? {
                      ...ss,
                      bullets: ss.bullets.map((b) =>
                        b.id === bulletId ? { ...b, content } : b,
                      ),
                    }
                  : ss,
              ),
            }
          : s,
      ),
    )
  }

  const handleSectionDrag = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = update.sections.findIndex((s) => s.id === active.id)
    const newIndex = update.sections.findIndex((s) => s.id === over.id)
    setSections(arrayMove(update.sections, oldIndex, newIndex))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Week of</span>
          <input
            type="date"
            value={update.weekOf}
            onChange={(e) =>
              onChange({ ...update, weekOf: e.target.value, id: e.target.value })
            }
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Title</span>
          <input
            type="text"
            value={update.title}
            onChange={(e) => onChange({ ...update, title: e.target.value })}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDrag}>
        <SortableContext
          items={update.sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {update.sections.map((section) => (
            <SortableItem key={section.id} id={section.id}>
              {({ dragHandleProps }) => (
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <button
                      type="button"
                      className="cursor-grab text-slate-400 hover:text-slate-600"
                      {...dragHandleProps}
                    >
                      ⠿
                    </button>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      className="flex-1 rounded border border-slate-300 px-3 py-1.5 text-sm font-semibold"
                      placeholder="Section title"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSections(update.sections.filter((s) => s.id !== section.id))
                      }
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="ml-6 space-y-4">
                    {section.subsections.map((subsection) => (
                      <div
                        key={subsection.id}
                        className="rounded border border-slate-100 bg-slate-50 p-3"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <input
                            type="text"
                            value={subsection.title}
                            onChange={(e) =>
                              updateSubsection(section.id, subsection.id, {
                                title: e.target.value,
                              })
                            }
                            className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
                            placeholder="Subsection title (optional)"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateSection(section.id, {
                                subsections: section.subsections.filter(
                                  (ss) => ss.id !== subsection.id,
                                ),
                              })
                            }
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="space-y-3">
                          {subsection.bullets.map((bullet) => (
                            <div key={bullet.id} className="flex gap-2">
                              <div className="flex-1">
                                <RichTextEditor
                                  content={bullet.content}
                                  onChange={(html) =>
                                    updateBullet(section.id, subsection.id, bullet.id, html)
                                  }
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  updateSubsection(section.id, subsection.id, {
                                    bullets: subsection.bullets.filter((b) => b.id !== bullet.id),
                                  })
                                }
                                className="self-start text-xs text-red-600 hover:text-red-800"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              updateSubsection(section.id, subsection.id, {
                                bullets: [...subsection.bullets, emptyBullet()],
                              })
                            }
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            + Add bullet
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        updateSection(section.id, {
                          subsections: [...section.subsections, emptySubsection()],
                        })
                      }
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      + Add subsection
                    </button>
                  </div>
                </div>
              )}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={() => setSections([...update.sections, emptySection()])}
        className="rounded border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600"
      >
        + Add section
      </button>
    </div>
  )
}
