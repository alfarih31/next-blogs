# Next Blogger

## Prerequisites

1. Node.js v16

## Set-up

### Development Config

1. Copy [.env.example](.env.example) as [.env](.env)

```bash
cp ./.env.example ./.env
```

2. Belows are available configurations:

| Key                      | Description                                | Required | Values     |
|--------------------------|--------------------------------------------|----------|------------|
| `NEXT_PUBLIC_APP_NAME`   | Application name                           | **✓**    | String     |
| `NEXT_PUBLIC_PUBLIC_URL` | URL where the application will be accessed | **✓**    | String     |
| `ENCRYPT_SECRET`         | Encryption secret                          | **✓**    | String(32) |
| `DATABASE_URL`           | Database URL                               | **✓**    | String     |
| `VERCEL_BLOB_RW_TOKEN`   | Vercel Blob Read Write Token               | **✓**    | String     |


### Install Dependencies

```bash
npm install
```

## Development

### Start App Development Runtime

```bash
npm run dev
```

### Contributors ###

- Alfarih Faza <alfarihfz@gmail.com>
