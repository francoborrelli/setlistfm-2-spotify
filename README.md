# 🎶 Setlist.fm to Spotify 🎧

<table>
<tr>
<td>
This TypeScript-based Node.js script fetches the latest setlist from one or multiple artists using the Setlist.fm API and imports it into a Spotify playlist. You can choose to create a new playlist or update an existing one. The Spotify integration is powered by the Spotify Web API.
</td>
<td>
<img width="1800" src="https://github.com/user-attachments/assets/864e5895-48dc-4afe-884c-44253e42db06"/>
</td>
</tr>
</table>



## ✨ Features

- 📥 Fetch the latest setlist from Setlist.fm for one or more artists.
- 🎧 Automatically create a new Spotify playlist or update an existing one.
- 🔗 Seamless integration with the Spotify Web API.
- 🐳 Docker support for easy setup.

## 🚀 Getting Started

### Prerequisites

Before running the script, ensure you have the following:

- [Node.js](https://nodejs.org/) installed
- A [Spotify Developer Account](https://developer.spotify.com/dashboard/applications) with access to the Web API
- Setlist.fm API key (Sign up at [Setlist.fm](https://api.setlist.fm/))
- [Docker](https://www.docker.com/) installed (optional, for Docker usage)

### 🔧 Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/francoborrelli/setlistfm-2-spotify.git
   ```

2. Navigate to the project directory:

   ```bash
   cd setlist-to-spotify-playlist
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```

4. Create a `.env` file with your Spotify and Setlist.fm credentials:

   ```bash
   SETLIST_API_KEY=your_setlistfm_api_key
   SPOTIFY_API_CLIENT_ID=your_spotify_client_id
   SPOTIFY_API_CLIENT_SECRET=your_spotify_client_secret
   ```

### ▶️ Usage

To run the script, use the following command:

```bash
yarn start
```

You will be prompted to authenticate with Spotify and choose between creating a new playlist or updating an existing one.

### 🐳 Docker Setup

If you prefer to run the project using Docker, follow these steps:

1. Build the Docker image:

   ```bash
   docker build -t setlistfm-2-spotify .
   ```

2. Run the Docker container:

   ```bash
   docker run --env-file .env setlistfm-2-spotify
   ```

The script will run inside the Docker container, and you'll still need to authenticate with Spotify.

## 🛠️ Built With

- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Setlist.fm API](https://api.setlist.fm/docs/1.0/index.html) - Fetching setlists
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) - Playlist management
- [Docker](https://www.docker.com/) - Containerization for easy setup

## 📝 License

This project is licensed under the MIT License.
