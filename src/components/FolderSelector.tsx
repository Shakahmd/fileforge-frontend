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
  return (
    <nav className="folder-selector" aria-label="Choose a folder">
      {folders.map((folder) => (
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
  )
}

export default FolderSelector
