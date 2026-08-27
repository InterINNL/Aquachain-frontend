export function totalPages(totalItems: number, size: number): number {
  if (size <= 0) {
    return 1;
  }
  return Math.max(1, Math.ceil(Math.max(0, totalItems) / size));
}

export function canGoNext(currentPage: number, pages: number): boolean {
  return currentPage < pages;
}

export function canGoPrev(currentPage: number): boolean {
  return currentPage > 1;
}
