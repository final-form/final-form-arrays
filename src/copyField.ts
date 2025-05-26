function copyField(
  oldFields: { [key: string]: any },
  oldKey: string,
  newFields: { [key: string]: any },
  newKey: string
): void {
  newFields[newKey] = {
    ...oldFields[oldKey],
    name: newKey,
    // prevent functions from being overwritten
    // if the newFields[newKey] does not exist, it will be created
    // when that field gets registered, with its own change/blur/focus callbacks
    change: oldFields[newKey] && oldFields[newKey].change,
    blur: oldFields[newKey] && oldFields[newKey].blur,
    focus: oldFields[newKey] && oldFields[newKey].focus,
    lastFieldState: undefined // clearing lastFieldState forces renotification
  }

  if (!newFields[newKey].change) {
    delete newFields[newKey].change
  }

  if (!newFields[newKey].blur) {
    delete newFields[newKey].blur
  }

  if (!newFields[newKey].focus) {
    delete newFields[newKey].focus
  }
}

export default copyField 