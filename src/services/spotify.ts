import open from 'open';
import Axios from 'axios';
import express from 'express';
import { Pagination, Playlist, PlaylistItem, SpotifyUser, Track } from '../interfaces/spotify';
import chalk from 'chalk';

export const SPOTIFY_API_URL = 'https://api.spotify.com/v1' as const;

const SPOTIFY_API_CLIENT_ID = process.env.SPOTIFY_API_CLIENT_ID as string;
const SPOTIFY_API_CLIENT_SECRET = process.env.SPOTIFY_API_CLIENT_SECRET as string;
const SPOTIFY_API_REDIRECT_URI = process.env.SPOTIFY_API_REDIRECT_URI || 'http://localhost:3000/';

const SPOTIFY_API_SCOPE =
  'playlist-modify-private playlist-modify-public playlist-read-private' as const;

const SPOTIFY_AUTH_URL =
  `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_API_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_API_REDIRECT_URI}&scope=${SPOTIFY_API_SCOPE}` as const;

const axios = Axios.create({
  baseURL: SPOTIFY_API_URL,
  headers: {},
});

let token: string | null = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error && error.response && error.response.status === 401) {
      token = await getSpotifyToken();
      return axios.request({
        ...error.config,
        headers: {
          ...error.config.headers,
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return Promise.reject(error);
  }
);

const app = express();

const getSpotifyToken = async () => {
  if (token) {
    return token;
  }

  return new Promise<string>((resolve, reject) => {
    app.get('/', async (req, res) => {
      try {
        axios
          .post(
            'https://accounts.spotify.com/api/token',
            {
              code: req.query.code,
              grant_type: 'authorization_code',
              client_id: SPOTIFY_API_CLIENT_ID,
              redirect_uri: SPOTIFY_API_REDIRECT_URI,
              client_secret: SPOTIFY_API_CLIENT_SECRET,
            },
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization:
                  'Basic ' +
                  Buffer.from(SPOTIFY_API_CLIENT_ID + ':' + SPOTIFY_API_CLIENT_SECRET).toString(
                    'base64'
                  ),
              },
            }
          )
          .then((response) => {
            token = response.data.access_token;
            resolve(token);
          });
        res.send('<script>window.close()</script>');
      } catch (err) {
        reject(err);
      }
    });
    app.listen(3000, async () => {});
    open(SPOTIFY_AUTH_URL, { app: { name: 'google chrome' } });
    return '';
  });
};

const getCurrentSpotifyUser = async () => {
  const token = await getSpotifyToken();
  return axios
    .get<SpotifyUser>('me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
};

const createPlaylist = async (userId: string, name: string, isPublic: boolean) => {
  const token = await getSpotifyToken();

  return axios
    .post<Playlist>(
      `users/${userId}/playlists`,
      {
        name,
        public: isPublic,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      console.log(
        `Playlist ${chalk.yellow(response.data.name)} created with id ${chalk.cyan(
          response.data.id
        )}`
      );
      console.log('  ');
      console.log('  ');
      return response.data;
    });
};

const getPlaylist = async (playlistId: string) => {
  const token = await getSpotifyToken();
  return axios
    .get<Playlist>(`playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error getting playlist', JSON.stringify(error.response.data));
      return null;
    });
};

const addTracksToPlaylist = async (playlist: Playlist, tracks: string[]) => {
  const token = await getSpotifyToken();

  if (tracks.length === 0) {
    return null;
  }

  return axios.post<void>(
    `playlists/${playlist.id}/tracks`,
    {
      uris: tracks,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const searchArtistTrack = async (artistName: string, trackName: string) => {
  const token = await getSpotifyToken();

  return axios
    .get<{
      tracks: Pagination<Track>;
      playlists: Pagination<Playlist>;
    }>('search', {
      params: {
        q: `${artistName} ${trackName}`,
        type: 'track',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
};

const getPlaylistCurrentTracks = async (playlistId: string) => {
  const token = await getSpotifyToken();

  let response = await axios.get<Pagination<PlaylistItem>>(`playlists/${playlistId}/tracks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const items = response.data.items || [];

  while (response.data.next) {
    response = await axios.get<Pagination<PlaylistItem>>(response.data.next, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    items.push(...response.data.items);
  }

  return items;
};

const removeAllTracksFromPlaylist = async (playlist: Playlist) => {
  const token = await getSpotifyToken();

  const items = await getPlaylistCurrentTracks(playlist.id);
  console.log(`Removing ${items.length} tracks from playlist`);
  const trackIds = items.map((item) => item.track.uri);

  const chunkedTrackIds: string[][] = [];
  for (let i = 0; i < trackIds.length; i += 100) {
    chunkedTrackIds.push(trackIds.slice(i, i + 100));
  }

  for (const chunk of chunkedTrackIds) {
    await axios.delete<void>(`playlists/${playlist.id}/tracks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        snapshot_id: playlist.snapshot_id,
        tracks: chunk.map((uri) => ({ uri })),
      },
    });
  }
  console.log('  ');
  console.log('All tracks removed from playlist');
  console.log('  ');
  console.log('  ');
};

export const SpotifyService = {
  getPlaylist,
  createPlaylist,
  getSpotifyToken,
  searchArtistTrack,
  addTracksToPlaylist,
  getCurrentSpotifyUser,
  getPlaylistCurrentTracks,
  removeAllTracksFromPlaylist,
};
