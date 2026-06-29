/**
 * Replace em dashes (—) with comma or colon for site content.
 */
export function replaceEmDashes(text) {
  let s = text

  s = s.replace(/Axon Weekly Update — Week of [^"<]*/g, 'Axon Weekly Update')
  s = s.replace(/([A-Za-z]+ \d{1,2}) — ([A-Za-z]+ \d{1,2})/g, '$1 to $2')
  s = s.replace(/Outstanding —/g, 'Outstanding:')
  s = s.replace(/In Progress —/gi, (m) => m.replace('—', ':'))
  s = s.replace(/Incident ingestion —/g, 'Incident ingestion:')
  s = s.replace(/Warrants —/g, 'Warrants:')
  s = s.replace(/After expungement —/g, 'After expungement:')
  s = s.replace(/Testing —/g, 'Testing:')
  s = s.replace(/Datastore view —/g, 'Datastore view:')
  s = s.replace(/root cause —/g, 'root cause:')
  s = s.replace(/TRACS\/Records review —/g, 'TRACS/Records review:')

  s = s.replace(/ — /g, (match, offset, str) => {
    const next = str[offset + match.length]
    return /^[a-z]/.test(next) ? ': ' : ', '
  })

  return s
}
