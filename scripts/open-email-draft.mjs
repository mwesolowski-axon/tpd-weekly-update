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
import { buildCfHtml } from './clipboard-html.mjs'

const execFileAsync = promisify(execFile)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTLOOK_SCRIPT = path.join(__dirname, 'open-outlook-draft.ps1')
const CLIPBOARD_SCRIPT = path.join(__dirname, 'set-clipboard-html.ps1')

function writeTempFile(prefix, ext, content, { bom = false } = {}) {
  const filePath = path.join(os.tmpdir(), `${prefix}-${Date.now()}${ext}`)
  fs.writeFileSync(filePath, bom ? `\uFEFF${content}` : content, 'utf8')
  return filePath
}

async function openOutlookDraft({ to, cc, subject, html }) {
  const htmlPath = writeTempFile('tpd-weekly-html', '.html', html, { bom: true })
  const configPath = writeTempFile(
    'tpd-weekly-outlook',
    '.json',
    JSON.stringify({ To: to, Cc: cc, Subject: subject, HtmlPath: htmlPath }),
    { bom: true },
  )

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

async function setClipboardHtml(html, plainText) {
  const htmlPath = writeTempFile('tpd-weekly-cfhtml', '.html', buildCfHtml(html))
  const plainPath = writeTempFile('tpd-weekly-plain', '.txt', plainText)
  try {
    await execFileAsync(
      'powershell',
      ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', CLIPBOARD_SCRIPT, '-HtmlPath', htmlPath, '-PlainPath', plainPath],
      { windowsHide: true },
    )
  } finally {
    for (const file of [htmlPath, plainPath]) {
      try {
        fs.unlinkSync(file)
      } catch {
        // temp cleanup is best-effort
      }
    }
  }
}

async function openGmailCompose({ to, cc, subject, html, plainText, gmailInbox = 0 }) {
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

  await setClipboardHtml(html, plainText)
  const url = `https://mail.google.com/mail/u/${gmailInbox}/?${params.toString()}`
  await execFileAsync(
    'powershell',
    ['-NoProfile', '-Command', `Start-Process '${url.replace(/'/g, "''")}'`],
    { windowsHide: true },
  )
  console.log(`Opened Gmail compose (inbox u/${gmailInbox}; formatted HTML copied — paste with Ctrl+V).`)
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

  const clients =
    config.emailClient === 'both' ? ['outlook', 'gmail'] : [config.emailClient]

  console.log('')
  console.log(`Opening email draft${clients.length > 1 ? 's' : ''} (${clients.join(', ')})...`)

  if (clients.includes('outlook')) {
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
  }

  if (clients.includes('gmail')) {
    try {
      await openGmailCompose({
        to: config.to,
        cc: config.cc,
        subject,
        html,
        plainText,
        gmailInbox: config.gmailInbox,
      })
    } catch (error) {
      console.warn(`Gmail compose failed: ${error.message}`)
    }
  }
}
