export interface SpotifyUser {
  display_name: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: [
    {
      url: string;
      height: number;
      width: number;
    },
    {
      url: string;
      height: number;
      width: number;
    }
  ];
  type: string;
  uri: string;
  followers: {
    href: null;
    total: number;
  };
  country: string;
  product: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  email: string;
}

export interface Playlist {
  /**
   * @description true if the owner allows other users to modify the playlist.
   */
  collaborative: boolean;

  /**
   * @description The playlist description. Only returned for modified, verified playlists, otherwise null.
   * @nullable
   * @example "Get happy with this pick-me-up playlist."
   * @type string
   */
  description: string | null;

  /**
   * @description A link to the Web API endpoint providing full details.
   */
  external_urls: {
    spotify: string;
  };

  /**
   * @description A link to the Web API endpoint providing full details.
   */
  href: string;

  /**
   * @description The Spotify ID for the playlist.
   * @example "37i9dQZF1DXcBWIGoYBM5M"
   * @type string
   * @pattern ^[a-zA-Z0-9]+$
   */
  id: string;

  /**
   * @description Images for the playlist. The array may be empty or contain up to three images. The images are returned by size in descending order. See Working with Playlists. Note: If returned, the source URL for the image (url) is temporary and will expire in less than a day.
   * @nullable
   * @type Image[]
   * @items
   * @maxItems 3
   * @minItems 0
   * @uniqueItems true
   */
  images: {
    url: string;
    height: number;
    width: number;
  }[];

  /**
   * @description Followers object
   */
  followers: {
    href: string;
    total: number;
  };

  /**
   * @description The name of the playlist.
   * @example "Today's Top Hits"
   * @type string
   */
  name: string;

  /**
   * @description The user who owns the playlist
   * @type User
   * @nullable
   */
  owner: SpotifyUser | null;

  /**
   * @description true if the playlist is public, false if it is private, null if not relevant.
   * @nullable
   * @type boolean
   */
  public: boolean | null;

  /**
   * @description The version identifier for the current playlist. Can be supplied in other requests to target a specific playlist version.
   * @example "7c9b1b4e"
   */
  snapshot_id: string;

  /**
   * @description Information about the tracks of the playlist.
   * @nullable
   */
  tracks: {
    href: string;
    total: number;
  } | null;

  /**
   * @description The object type: "playlist"
   */
  type: 'playlist';

  /**
   * @description The Spotify URI for the playlist.
   * @example "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M"
   * @type string
   */
  uri: string;
}

export interface PlaylistItem {
  added_at: string;
  added_by: SpotifyUser;
  is_local: boolean;
  primary_color: string;
  track: Track;
}

export interface Album {
  /** @description The type of the album. */
  album_type: 'album' | 'single' | 'compilation';

  /** @description The artists of the album. Each artist object includes a link in href to more detailed information about the artist. */
  artists: SimpleArtist[];

  /** @description The markets in which the album is available: ISO 3166-1 alpha-2 country codes. NOTE: an album is considered available in a market when at least 1 of its tracks is available in that market. */
  available_markets: string[];

  /** @description Known external URLs for this album. */
  external_urls: {
    spotify: string;
  };

  /** @description A link to the Web API endpoint providing full details of the album. */
  href: string;

  /** @description The Spotify ID for the album. */
  id: string;

  /** @description The cover art for the album in various sizes, widest first. */
  images: {
    url: string;
    width: number;
    height: number;
  }[];

  /** @description The name of the album. In case of an album takedown, the value may be an empty string. */
  name: string;

  /** @description The date the album was first released. */
  release_date: string;

  /** @description The precision with which release_date value is known. */
  release_date_precision: 'year' | 'month' | 'day';

  /** @description The number of tracks in the album.. */
  total_tracks: number;

  /** @description The object type. */
  type: 'album';

  /** @description The Spotify URI for the album. */
  uri: string;
}

export interface Artist {
  /** @description Known external URLs for this artist. */
  external_urls: {
    /** @description The Spotify URL for the object. */
    spotify: string;
  };

  /** @description Information about the followers of the artist. */
  followers: {
    /** @description This will always be set to null, as the Web API does not support it at the moment. */
    href: string;

    /** @description The total number of followers. */
    total: number;
  };

  /**
   * @description A list of the genres the artist is associated with. If not yet classified, the array is empty.
   * @example ["Prog rock","Grunge"]
   */
  genres: string[];

  /** @description A link to the Web API endpoint providing full details of the artist. */
  href: string;

  /** @description The Spotify ID for the artist. */
  id: string;

  /** @description Images of the artist in various sizes, widest first. */
  images: {
    url: string;
    height: number;
    width: number;
  }[];

  /** @description The name of the artist. */
  name: string;

  /** @description The popularity of the artist. The value will be between 0 and 100, with 100 being the most popular. The artist's popularity is calculated from the popularity of all the artist's tracks. */
  popularity: number;

  /** @description The object type. */
  type: 'artist';

  /** @description The Spotify URI for the artist. */
  uri: string;
}

export type SimpleArtist = Pick<Artist, 'external_urls' | 'id' | 'href' | 'name' | 'type' | 'uri'>;

export interface Track {
  /** @description The album on which the track appears. The album object includes a link in href to full information about the album. */
  album: Album;

  /** @description The artists who performed the track. Each artist object includes a link in href to more detailed information about the artist */
  artists: SimpleArtist[];

  /** @description A list of the countries in which the track can be played, identified by their ISO 3166-1 alpha-2 code. */
  available_markets: string[];

  /** @description The disc number (usually 1 unless the album consists of more than one disc). */
  disc_number: number;

  /** @description The track length in milliseconds. */
  duration_ms: number;

  /** @description Whether or not the track has explicit lyrics ( true = yes it does; false = no it does not OR unknown). */
  explicit: boolean;

  /** @description Known external IDs for the track. */
  external_ids: {
    isrc: string;
  };

  /** @description Known external URLs for this track. */
  external_urls: {
    /** @description The Spotify URL for the object. */
    spotify: string;
  };

  /** @description A link to the Web API endpoint providing full details of the track. */
  href: string;

  /** @description The Spotify ID for the track. */
  id: string;

  /** @description Whether or not the track is from a local file. */
  is_local: false;

  /** @description Part of the response when Track Relinking is applied. If true, the track is playable in the given market. Otherwise false. */
  is_playable: boolean;

  /** @description The name of the track. */
  name: string;

  /** @description The popularity of the track. The value will be between 0 and 100, with 100 being the most popular. The track's popularity is calculated from the popularity of all the track's album. */
  popularity: number;

  /** @description A URL to a 30 second preview (MP3 format) of the track. */
  preview_url: string;

  /** @description The number of the track. If an album has several discs, the track number is the number on the specified disc. */
  track_number: number;

  /** @description The object type. */
  type: 'track';

  /** @description The Spotify URI for the track. */
  uri: string;
}

export interface Pagination<T> {
  /** @description A link to the Web API endpoint returning the full result of the request */
  href: string;

  items: T[];

  /** @description The maximum number of items in the response (as set in the query or by default). */
  limit: number;

  /** @description The offset of the items returned (as set in the query or by default) */
  offset: number;

  /** @description URL to the previous page of items. ( null if none) */
  previous: string | null;

  /** @description URL to the next page of items. ( null if none) */
  next: string | null;

  /** @description The total number of items available to return.. */
  total: number;
}
