import { useEffect } from 'react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { useGlobalSearch } from '@/hooks/useGlobalSearch'
import { useEntityDrawer } from '@/contexts/EntityDrawerContext'
import type { EntityType } from '@/types/entity'

interface GlobalSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const { query, setQuery, results, loading, error, clearSearch } = useGlobalSearch()
  const { openDrawer } = useEntityDrawer()

  // Clear search when modal closes
  useEffect(() => {
    if (!open) {
      clearSearch()
    }
  }, [open, clearSearch])

  const handleResultClick = (doctype: string, name: string) => {
    // Map doctype to EntityType (lowercase)
    const entityType = doctype.toLowerCase() as EntityType

    // Open drawer with entity
    openDrawer(entityType, name)

    // Close modal
    onOpenChange(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search for professionals, licenses, facilities..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {error !== null
            ? error
            : loading
            ? 'Searching...'
            : query.length === 0
            ? 'Type to search...'
            : query.length < 2
            ? 'Type at least 2 characters...'
            : results.length === 0
            ? 'No results found'
            : 'No results found'}
        </CommandEmpty>

        {results.map((group) => (
          <CommandGroup key={group.title} heading={group.title}>
            {group.results.map((result) => (
              <CommandItem
                key={`${result.doctype}-${result.name}`}
                onSelect={() => handleResultClick(result.doctype, result.name)}
              >
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">{result.title}</span>
                  {result.description && (
                    <span className="text-sm text-muted-foreground">
                      {result.description}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
