import chalk from 'chalk';

import { SpotifyService } from '../services/spotify';
import { SetlistFmService } from '../services/setlist';

import type { Playlist } from '../interfaces/spotify';

const transferArtistLatestSetlistToPlaylist = async (artistName: string, playlist: Playlist) => {
  const setlist = await SetlistFmService.getArtistLatestSongs(artistName);

  const promises = setlist.map((song) => {
    return SpotifyService.searchArtistTrack(artistName, song);
  });

  const trackUris = await Promise.all(promises).then((responses) => {
    return responses.map((response) => {
      if (response.tracks.items && response.tracks.items.length > 0) {
        console.log(
          `Found track ${chalk.blueBright(response.tracks.items[0].name)} from ${chalk.redBright(
            response.tracks.items[0].artists[0].name
          )}`
        );
        return response.tracks.items[0].uri;
      }
    });
  });

  if (trackUris) {
    await SpotifyService.addTracksToPlaylist(playlist, trackUris);
  }
};

export const transferArtistsSetlistToNewPlaylist = async (
  artistNames: string[],
  playlistName: string
) => {
  const me = await SpotifyService.getCurrentSpotifyUser();
  const playlist = await SpotifyService.createPlaylist(me.id, playlistName);

  for (const artistName of artistNames) {
    console.log(`Transferring setlist for ${chalk.greenBright(artistName)}`);
    await transferArtistLatestSetlistToPlaylist(artistName, playlist);
  }
};

export const transferArtistsSetlistsToExistingPlaylist = async (
  artistNames: string[],
  playlistId: string,
  deleteExistingTracks: boolean
) => {
  const playlist = await SpotifyService.getPlaylist(playlistId);

  if (deleteExistingTracks) {
    console.log('  ');
    console.log('  ');
    console.log('Removing all previous tracks from playlist');
    await SpotifyService.removeAllTracksFromPlaylist(playlist);
    console.log('--------------------------');
    console.log('  ');
  }

  console.log('Transferring setlists from artists to Spotify playlist');

  for (const artistName of artistNames) {
    console.log('  ');
    console.log('  ');

    console.log(`Transferring setlist for ${chalk.greenBright(artistName)}`);

    await transferArtistLatestSetlistToPlaylist(artistName, playlist);

    console.log('  ');
    console.log('  ');
    console.log('--------------------------');

    //  sleep(1000) to avoid request rate limit
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
