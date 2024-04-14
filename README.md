# React Notes

## Development

Install dependencies:

```sh
npm install
```

Start web app server:

```sh
npm start
```

Start JSON server:

```sh
npx json-server db.json --port 4000
```

Set initial `db.json`, for instance :

```json
{
  "notes": [
    {
      "title": "Nouvelle note",
      "content": "",
      "lastUpdatedAt": "2024-04-05T13:27:23.186Z",
      "id": 68
    },
    {
      "title": "Nouvelle note",
      "content": "",
      "lastUpdatedAt": "2024-04-05T13:27:23.498Z",
      "id": 69
    },
    {
      "title": "Nouvelle note",
      "content": "",
      "lastUpdatedAt": "2024-04-05T13:27:23.622Z",
      "id": 70
    }
  ],
  "profile": {
    "name": "Mathis"
  }
}
```
