import { Plus } from 'lucide-react'

export type DocumentKindOption = 'pdf' | 'image' | 'text'

const kindOptions: Array<{
  value: DocumentKindOption | null
  label: string
  description: string
}> = [
  {
    value: 'image',
    label: 'Ảnh',
    description: 'Phù hợp với tài liệu chụp hoặc scan.',
  },
  {
    value: 'pdf',
    label: 'PDF',
    description: 'Phù hợp với tài liệu nhiều trang.',
  },
  {
    value: 'text',
    label: 'Văn bản',
    description: 'Tạo phiên từ nội dung nhập tay.',
  },
]

export function WorkspaceDocumentKindStep({
  selectedKind,
  onSelectKind,
}: {
  selectedKind: DocumentKindOption | null
  onSelectKind: (kind: DocumentKindOption | null) => void
}) {
  return (
    <div className="grid gap-2">
      {kindOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelectKind(option.value)}
          className={`rounded-xl border px-4 py-3 text-left transition-colors ${
            selectedKind === option.value
              ? 'border-ring bg-accent text-accent-foreground'
              : 'border-border bg-card hover:bg-accent'
          }`}
        >
          <div className="flex items-start gap-2">
            <Plus className="mt-0.5 h-4 w-4" />
            <div>
              <p className="text-sm font-semibold">{option.label}</p>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}