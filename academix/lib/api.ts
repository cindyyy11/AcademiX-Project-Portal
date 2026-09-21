// Base URL of the backend REST API, always ending in a slash. Set
// NEXT_PUBLIC_SERVER_URI (see .env.example) to the deployed backend, e.g.
// "https://api.example.com/api/v1/". Without it the local backend is used, so
// development works with no configuration.
const DEFAULT_API_URL = "http://localhost:8000/api/v1/";

export const API_URL = `${(process.env.NEXT_PUBLIC_SERVER_URI || DEFAULT_API_URL).replace(/\/+$/, "")}/`;
