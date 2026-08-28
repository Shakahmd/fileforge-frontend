import { useMemo, useState } from 'react'

export interface FolderOption {
  label: string
  value: string
}

interface FolderSelectorProps {
  folders: FolderOption[]
  selectedFolder: string
  disabled?: boolean
  onSelect: (folder: string) => void
}

/** A compact folder picker that delegates the selected folder to its parent. */
function FolderSelector({ folders, selectedFolder, disabled = false, onSelect }: FolderSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const matchingFolders = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase()
    if (!query) return folders

    return folders.filter((folder) => folder.label.toLocaleLowerCase().includes(query))
  }, [folders, searchTerm])

  return (
    <div className="folder-picker">
      <label className="folder-search-label" htmlFor="folder-search">Search folders</label>
      <input
        className="folder-search"
        disabled={disabled}
        id="folder-search"
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search folders..."
        type="search"
        value={searchTerm}
      />
      <nav className="folder-selector" aria-label="Choose a folder">
        {matchingFolders.map((folder) => (
        <button
          aria-pressed={selectedFolder === folder.value}
          className={`folder-button${selectedFolder === folder.value ? ' is-selected' : ''}`}
          disabled={disabled}
          key={folder.value}
          onClick={() => onSelect(folder.value)}
          type="button"
        >
          {folder.label}
        </button>
        ))}
      </nav>
      {searchTerm && matchingFolders.length === 0 && (
        <p className="folder-search-empty" role="status">No folders match “{searchTerm}”.</p>
      )}
    </div>
  )
}

export default FolderSelector
