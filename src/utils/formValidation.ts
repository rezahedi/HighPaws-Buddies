export function stringLength(str: string, min: number, max: number): boolean {
  return str.length >= min && str.length <= max
}

export function HTMLSanitize(str: string): string {
  return str.trim().replace(/<[^>]*>?/gm, '')
}