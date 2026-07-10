export function buildCfHtml(htmlFragment) {
  const markerBlock = [
    'Version:0.9',
    'StartHTML:<<<<<<<<1',
    'EndHTML:<<<<<<<<2',
    'StartFragment:<<<<<<<<3',
    'EndFragment:<<<<<<<<4',
    '',
  ].join('\r\n')

  const html = `<html><body><!--StartFragment-->${htmlFragment}<!--EndFragment--></body></html>`
  let result = markerBlock + html

  const startHtml = markerBlock.length
  const endHtml = result.length
  const startFragment = result.indexOf('<!--StartFragment-->') + '<!--StartFragment-->'.length
  const endFragment = result.indexOf('<!--EndFragment-->')

  result = result
    .replace('<<<<<<<<1', String(startHtml).padStart(10, '0'))
    .replace('<<<<<<<<2', String(endHtml).padStart(10, '0'))
    .replace('<<<<<<<<3', String(startFragment).padStart(10, '0'))
    .replace('<<<<<<<<4', String(endFragment).padStart(10, '0'))

  return result
}
