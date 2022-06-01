export interface AboutFuture {
  version: string;
  date_month: string;
  date_year: string;
  bullets: string[];
}

export interface AboutData {
  copyright?: string;
  future: AboutFuture[];
  release_notes: string[];
}
