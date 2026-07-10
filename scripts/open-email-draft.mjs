import fs from 'fs'
import os from 'os'
import path from 'path'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { fileURLToPath } from 'url'
import { getEmailConfig, extractEmails } from './email-config.mjs'
import {
  buildEmailSubject,
  updateToEmailHtml,
  updateToEmailPlainText,
} from './email-body.mjs'

const execFileAsync = promisify(execFile)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTLOOK_SCRIPT = path.join(__dirname, 'open-outlook-draft.ps1')

function writeTempFile(prefix, ext, content) {
  const filePath = path.join(os.tmpdir(), `${prefix}-${Date.now()}${ext}`)
  fs.writeFileSync(filePath, content, 'utf8')
  return filePath
}

async function openOutlookDraft({ to, cc, subject, html }) {
  const htmlPath = writeTempFile('tpd-weekly-html', '.html', html)
  const configPath = writeTempFile('tpd-weekly-outlook', '.json', JSON.stringify({ To: to, Cc: cc, Subject: subject, HtmlPath: htmlPath }))

  try {
    await execFileAsync(
      'powershell',
      ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', OUTLOOK_SCRIPT, '-ConfigPath', configPath],
      { windowsHide: true },
    )
    console.log('Opened Outlook draft.')
  } finally {
    try {
      fs.unlinkSync(configPath)
    } catch {
      // temp cleanup is best-effort
    }
  }
}

async function setClipboard(text) {
  const plainPath = writeTempFile('tpd-weekly-plain', '.txt', text)
  try {
    await execFileAsync(
      'powershell',
      ['-NoProfile', '-Command', `Set-Clipboard -Value ([System.IO.File]::ReadAllText('${plainPath.replace(/'/g, "''")}'))`],
      { windowsHide: true },
    )
  } finally {
    try {
      fs.unlinkSync(plainPath)
    } catch {
      // temp cleanup is best-effort
    }
  }
}

async function openGmailCompose({ to, cc, subject, plainText }) {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: extractEmails(to).join(','),
    su: subject,
  })
  const ccEmails = extractEmails(cc)
  if (ccEmails.length > 0) {
    params.set('cc', ccEmails.join(','))
  }

  await setClipboard(plainText)
  const url = `https://mail.google.com/mail/?${params.toString()}`
  await execFileAsync('cmd', ['/c', 'start', '', url], { windowsHide: true })
  console.log('Opened Gmail compose (body copied to clipboard — paste with Ctrl+V).')
}

export async function openEmailDraft(update) {
  const config = getEmailConfig()
  if (!config.to) {
    console.log('')
    console.log('Email drafts skipped — set EMAIL_TO in .env to enable.')
    return
  }

  const subject = buildEmailSubject(config.subjectTemplate, update.weekOf)
  const html = updateToEmailHtml(update, config.siteUrl)
  const plainText = updateToEmailPlainText(update, config.siteUrl)

  console.log('')
  console.log('Opening email drafts...')

  try {
    await openOutlookDraft({
      to: config.to,
      cc: config.cc,
      subject,
      html,
    })
  } catch (error) {
    console.warn(`Outlook draft failed: ${error.message}`)
  }

  try {
    await openGmailCompose({
      to: config.to,
      cc: config.cc,
      subject,
      plainText,
    })
  } catch (error) {
    console.warn(`Gmail compose failed: ${error.message}`)
  }
}
