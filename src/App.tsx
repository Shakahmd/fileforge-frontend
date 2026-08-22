import { useState } from 'react'
import './App.css'

interface FileItem {
  fileName: string
  size: number | string
}

const extensionColors: Record<string, string> = {
  png: '#4dd9c0', jpg: '#4dd9c0', jpeg: '#4dd9c0', json: '#f2b84b',
  zip: '#e27d6b', glsl: '#8c9eff', ogg: '#c792ea', tscn: '#4dd9c0', default: '#8a93a6',
}

function getExtension(fileName: string) {
  const parts = fileName.split('.')
  return parts.length > 1 ? parts.at(-1)?.toLowerCase() ?? '' : ''
}



function App() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [error, setError] = useState('')

  const getFiles = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('http://localhost:3004/api/files')
      if (!response.ok) throw new Error('Unable to reach the files service.')
      const data = await response.json()
      if (!data.success || !Array.isArray(data.data)) throw new Error('The files service returned an unexpected response.')
      setFiles(data.data)
      setFetched(true)
    } catch (requestError) {
      setFiles([])
      setFetched(true)
      setError(requestError instanceof Error ? requestError.message : 'Unable to load files.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="file-vault" aria-labelledby="files-heading">
        <header className="vault-header">
          <p id="files-heading" className="vault-title">Files</p>
          {fetched && <span className="file-count">{files.length} found</span>}
        </header>
        <button className="fetch-button" type="button" onClick={getFiles} disabled={loading}>
          <span className="terminal-cursor" aria-hidden="true" />
          {loading ? 'fetching...' : 'get my files'}
        </button>
        {error && <p className="status-message error-message">$ {error}</p>}
        {fetched && files.length === 0 && !loading && !error && <p className="status-message">$ no files found</p>}
        {files.length > 0 && (
          <ul className="file-list">
            {files.map((file, index) => {
              const extension = getExtension(file.fileName)
              const color = extensionColors[extension] ?? extensionColors.default
              return (
                <li className="file-row" key={`${file.fileName}-${index}`}>
                  <span className="extension-badge" style={{ color, backgroundColor: `${color}1a` }}>{extension || '—'}</span>
                  <span className="file-name" title={file.fileName}>{file.fileName}</span>
                  <span className="file-size">{file.size}</span>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
