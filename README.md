# SimpleDisco

## Getting Started

First, make a copy of the `.env.example` and name it `.env` and fill in the secrets

Second, create a copy of `.nrpc.example` and name it `.nprc` and add the token for TipTap

Next, run `npm i && npx prisma pull && npx prisma generate`

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
