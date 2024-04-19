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
      "title": "COmment cava",
      "content": "oui",
      "lastUpdatedAt": "2024-04-19T14:55:52.581Z",
      "checked": false,
      "tags": [
        {
          "value": "non",
          "id": 633
        }
      ],
      "id": "46b0"
    },
    {
      "title": "hello",
      "content": "oui ! ",
      "lastUpdatedAt": "2024-04-19T14:55:27.816Z",
      "checked": false,
      "tags": [
        {
          "value": "non",
          "id": 314
        }
      ],
      "id": "c2ff"
    },
    {
      "title": "Note numéro 2",
      "content": "!!!!!!!!!!!!!!!!!!!!",
      "lastUpdatedAt": "2024-04-19T14:55:22.311Z",
      "checked": false,
      "tags": [
        {
          "value": "non",
          "id": 313
        }
      ],
      "id": "c06d"
    },
    {
      "title": "Note numéro 1",
      "content": "oui",
      "lastUpdatedAt": "2024-04-19T14:55:14.996Z",
      "checked": false,
      "tags": [
        {
          "value": "note",
          "id": 672
        },
        {
          "value": "coucou",
          "id": 303
        },
        {
          "value": "kljkl",
          "id": 59
        }
      ],
      "id": "d057"
    }
  ],
  "profile": {
    "name": "Mathis"
  }
}
```
