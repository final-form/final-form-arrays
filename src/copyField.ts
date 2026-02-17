import { InternalFieldState } from 'final-form'

function copyField(
  oldFields: { [key: string]: InternalFieldState<any> },
  oldKey: string,
  newFields: { [key: string]: Partial<InternalFieldState<any>> },
  newKey: string
): void {
  // If there's already a field at the target position, use its functions (for moves/swaps)
  // Otherwise, preserve functions from source field (for moves with different shapes #51)
  const useExistingFunctions = oldFields[newKey] != null
  
  newFields[newKey] = {
    ...oldFields[oldKey],
    name: newKey,
    change: useExistingFunctions ? oldFields[newKey].change : oldFields[oldKey].change,
    blur: useExistingFunctions ? oldFields[newKey].blur : oldFields[oldKey].blur,
    focus: useExistingFunctions ? oldFields[newKey].focus : oldFields[oldKey].focus,
    lastFieldState: undefined // clearing lastFieldState forces renotification
  }
}

export default copyField 