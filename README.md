Cardano studio code is a unified, plug-and-play development environment designed to streamline building on Cardano. It provides ready-made templates, tooling, and workflows for both on-chain and off-chain development — all in one place.

## Development

### Install

```sh
npm install
```

### Run the app

```sh
npm run dev
```

### Run the auth server

```sh
npm run server
```

## OAuth Setup (Google + GitHub)

1. Copy `.env.example` to `.env`.
2. Create OAuth apps in Google Cloud Console and GitHub Developer Settings.
3. Set the callback URL to `http://localhost:4000/auth/google/callback` and `http://localhost:4000/auth/github/callback`.
4. Add your client IDs and secrets to `.env`.

The frontend uses `VITE_API_URL` for auth and API requests. Leave it empty for the Vite proxy in development.
