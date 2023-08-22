const currentYear: number = new Date().getFullYear();
export const next20Years: string[] = Array.from({ length: 20 }, (_, index) => (currentYear + index).toString());