import Axios from 'axios';
import type { PlaylistResponse, Setlist } from '../interfaces/setlistfm';

const SETLIST_API_KEY = process.env.SETLIST_API_KEY || '';
const SET_LIST_URL = 'https://api.setlist.fm/rest/1.0/search/' as const;

const MIN_SONGS = 6;

const axios = Axios.create({
  baseURL: SET_LIST_URL,
  headers: {
    'x-api-key': SETLIST_API_KEY,
    Accept: 'application/json',
  },
});

const fetchSetlist = async (artistName: string) => {
  return axios
    .get<PlaylistResponse>('/setlists', {
      params: { artistName },
    })
    .then((response) => response.data);
};

const getArtistLatestSetlist = async (artistName: string) => {
  try {
    const response = await fetchSetlist(artistName);
    const { setlist: setlists } = response;
    return setlists.find(
      (setlist) => setlist.sets.set.length && setlist.sets.set[0].song.length >= MIN_SONGS
    );
  } catch (error) {
    return null;
  }
};

export const getArtistLatestSongs = async (artistName: string) => {
  const setlist = await getArtistLatestSetlist(artistName);

  if (!setlist) {
    return [];
  }

  return (setlist as Setlist).sets.set.map((set) => set.song.map((song) => song.name)).flat();
};

export const SetlistFmService = {
  fetchSetlist,
  getArtistLatestSongs,
  getArtistLatestSetlist,
};
