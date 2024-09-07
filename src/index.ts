import {
  transferArtistsSetlistToNewPlaylist,
  transferArtistsSetlistsToExistingPlaylist,
} from './actions';
import { input, select, confirm } from '@inquirer/prompts';

import { SETS } from './constants/sets';

let artist: string[] = [];

const renderMenu = async () => {
  const OPTION = await select({
    message: 'Select an option',
    choices: [
      {
        name: 'Search Artist',
        value: 'artist',
        description: 'Write the name of the artist you want to search',
      },
      {
        name: 'Select from existing set',
        value: 'existingset',
        description: 'Select from a set of predefined artists',
      },
    ],
  });

  switch (OPTION) {
    case 'artist':
      const response = await input({ message: 'Enter the name of the artists. (Comma separated)' });
      artist = response.split(',').map((artist) => artist.trim());
      break;
    case 'existingset':
      artist = await select({
        message: 'Select a predefined artist or set of artists',
        choices: Object.keys(SETS).map((key) => ({
          name: SETS[key].name,
          value: SETS[key].artists,
          description: SETS[key].description,
        })),
      });
  }

  const useExistingSpotifyPlaylist = await confirm({
    message:
      'Do you want to use an existing Spotify playlist? (If not, a new playlist will be created)',
    default: true,
  });

  if (useExistingSpotifyPlaylist) {
    const playlistId = await input({ message: 'Enter the playlist ID' });
    const deleteExistingTracks = await confirm({
      message: 'Do you want to delete existing tracks from the playlist before importing?',
      default: true,
    });
    return await transferArtistsSetlistsToExistingPlaylist(
      artist,
      playlistId,
      deleteExistingTracks
    ).then(() => {
      console.log('Finished transferring setlists');
    });
  }

  const playlistName = await input({ message: 'Enter the playlist name' });
  const isPublic = await confirm({
    message: 'Do you want the playlist to be public?',
    default: true,
  });
  return await transferArtistsSetlistToNewPlaylist(artist, playlistName, isPublic).then(() => {
    console.log('Finished transferring setlists');
  });
};

renderMenu();
