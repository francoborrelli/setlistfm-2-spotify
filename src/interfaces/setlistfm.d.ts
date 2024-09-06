interface Setlist {
  id: string;
  versionId: string;
  eventDate: string;
  lastUpdated: string;
  artist: Artist;
  venue: Venue;
  tour: Tour;
  sets: Sets;
  url: string;
}

interface Artist {
  mbid: string;
  name: string;
  sortName: string;
  disambiguation: string;
  url: string;
}

interface Venue {
  id: string;
  name: string;
  city: City;
  url: string;
}

interface City {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  coords: Coordinates;
  country: Country;
}

interface Coordinates {
  lat: number;
  long: number;
}

interface Country {
  code: string;
  name: string;
}

interface Tour {
  name: string;
}

interface Sets {
  set: Set[];
}

interface Set {
  song: Song[];
}

interface Song {
  name: string;
  tape?: boolean;
  cover?: Cover;
  info?: string;
}

interface Cover {
  mbid: string;
  name: string;
  sortName: string;
  disambiguation: string;
  url: string;
}
export interface PlaylistResponse {
  setlist: Setlist[];
  total: number;
  page: number;
  itemsPerPage: number;
}
