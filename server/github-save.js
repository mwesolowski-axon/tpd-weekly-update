import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { Octokit } from '@octokit/rest'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function getRepoParts() {
  const repo = process.env.GITHUB_REPO || ''
  if (!repo.includes('/')) {
    throw new Error('GITHUB_REPO must be set to owner/repo')
  }
  const [owner, name] = repo.split('/')
  return { owner, repo: name, branch: process.env.GITHUB_BRANCH || 'main' }
}

function getAllowlist() {
  const path = resolve(ROOT, 'public/data/admin-allowlist.json')
  const entries = JSON.parse(readFileSync(path, 'utf8'))
  return entries.map((e) => String(e).trim().toLowerCase())
}

export function isAllowlisted(email) {
  const normalized = email.trim().toLowerCase()
  return getAllowlist().includes(normalized)
}

function encodeContent(content) {
  return Buffer.from(content, 'utf8').toString('base64')
}

async function getFileSha(octokit, owner, repo, branch, path) {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path, ref: branch })
    if (!Array.isArray(data) && data.type === 'file') return data.sha
  } catch {
    return undefined
  }
  return undefined
}

export async function saveUpdate(update, index) {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN is not configured on the server')

  const octokit = new Octokit({ auth: token })
  const { owner, repo, branch } = getRepoParts()
  const updatePath = `public/data/updates/${update.id}.json`
  const indexPath = 'public/data/updates/index.json'
  const updateContent = JSON.stringify(update, null, 2)
  const indexContent = JSON.stringify(index, null, 2)

  const updateSha = await getFileSha(octokit, owner, repo, branch, updatePath)
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: updatePath,
    message: `Update weekly report: week of ${update.weekOf}`,
    content: encodeContent(updateContent),
    sha: updateSha,
    branch,
  })

  const indexSha = await getFileSha(octokit, owner, repo, branch, indexPath)
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: indexPath,
    message: `Update index for week of ${update.weekOf}`,
    content: encodeContent(indexContent),
    sha: indexSha,
    branch,
  })
}
