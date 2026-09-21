# Backend and Frontend Integration Guide

This document describes the backend as it currently exists in this repository. It is intended to give an agent or frontend developer enough information to run the service, call its APIs, understand the returned data, and account for current limitations.

## Service Overview

- Runtime: Node.js with TypeScript and native ES modules.
- HTTP framework: Express 5.
- Database: MongoDB through Mongoose.
- Scraping engine: Playwright Chromium.
- Default server URL: `http://localhost:3000`.
- Default CORS policy: all origins are allowed (`*`).
- Data source: Flipkart product search pages.
- Supported product category normalization: iPhone, iPad, and MacBook.

The server connects to MongoDB before it starts listening. A failed database connection exits the process.

## Running the Backend

Install dependencies and install the Playwright browser used by the scraper:

```bash
npm install
npx playwright install chromium
```

Set the MongoDB connection string in `.env`:

```env
MONGODB_URI=<your-mongodb-connection-string>
```

Available scripts:

```bash
npm run dev    # Start with tsx watch mode
npm run check  # TypeScript validation without emitting files
npm run build  # Emit compiled JavaScript to dist/
npm start      # Run dist/index.js
```

## Base URL and Transport

Use the following base URL from a local frontend:

```text
http://localhost:3000
```

All responses are JSON. The backend currently enables CORS for every origin, so a browser frontend can call it directly without a development proxy. No authentication, authorization, rate limiting, or API version prefix is implemented.

The backend does not call `express.json()`. There are currently no endpoints that accept a JSON request body. Send scraper inputs as query parameters only.

## API Reference

### `GET /`

Health-style root response.

Example request:

```http
GET http://localhost:3000/
```

Success response, status `200`:

```json
{
  "meeage": " you are the best broooo"
}
```

The key is intentionally documented as `meeage` because that is the current implementation spelling. Do not use this endpoint as a structured health check without accounting for that spelling.

### `GET /scrape`

Simple scraper route check. It does not run the scraper or access the database.

Example request:

```http
GET http://localhost:3000/scrape
```

Success response, status `200`:

```json
{
  "message": "ok"
}
```

The route's `500` branch is not expected to be reached by its current implementation, but clients should still handle non-2xx responses.

### `POST /scrape`

Runs the Playwright scraper and persists products and offers.

Example request:

```http
POST http://localhost:3000/scrape?q=iphone&page=1
```

#### Query parameters

| Parameter | Type | Required | Current behavior |
| --- | --- | --- | --- |
| `q` | string | No | Read by the route but currently ignored. |
| `page` | number | No | Read by the route but currently ignored. Defaults internally to `1`. |

Despite reading `q` and `page`, the current route always scrapes this fixed URL:

```text
https://www.flipkart.com/search?q=iphone&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off&as-pos=1&as-type=HISTORY
```

The scrape flow is:

1. Open Flipkart with headless Chromium.
2. Extract product cards using the selectors in `src/lib/scraper/selector.ts`.
3. For each product, look for an existing offer by `sourceProductId`.
4. If an offer exists, update it when price or availability changed.
5. If no offer exists, create a product and a new offer.
6. If offer creation fails after product creation, delete the new product as a rollback.

Success response when cards are found, status `200`:

```json
{
  "result": [
    {
      "success": true,
      "sourceProductId": "source-id",
      "reason": "product_available",
      "changed": false
    },
    {
      "success": true,
      "sourceProductId": "new-source-id",
      "createdProduct": {},
      "createdOffer": {}
    }
  ],
  "message": "product created"
}
```

The exact result item depends on whether the product was already known, updated, or newly created. Individual product failures are represented inside `result` rather than causing the whole request to fail. Possible failure reasons include:

- `product_creation_failed`
- `invalid_product_data`
- `offer_creation_failed_product_rolled_back`

When the scraper finds no products, status `200` is returned:

```json
{
  "message": "no products found scraper does not work"
}
```

Unexpected route-level errors return status `500` with an `error` value. The value may be an error object and should be treated as opaque by the frontend.

Important frontend behavior: this request can take several seconds because it launches Chromium and waits for Flipkart content. Use a loading state, disable duplicate scrape actions, and handle timeout/network failures. The response is not a live progress stream; the frontend receives one final JSON response.

### `GET /product`

Returns products stored in MongoDB, newest first.

Example request:

```http
GET http://localhost:3000/product?page=1&size=20
```

#### Query parameters

| Parameter | Type | Required in practice | Meaning |
| --- | --- | --- | --- |
| `page` | positive integer | Yes | 1-based page number. |
| `size` | positive integer | Yes | Number of records to return. |

The implementation passes the query values directly into `skip(size * (page - 1))` and `limit(size)`. Supplying missing or non-numeric values can produce invalid pagination behavior, so the frontend should always send valid positive integers.

Success response, status `200`:

```json
{
  "message": "heyy",
  "data": [
    {
      "_id": "mongo-object-id",
      "source": "flipkart",
      "sourceProductId": "source-id",
      "title": "Apple iPhone ...",
      "brand": "Apple",
      "category": "iPhone",
      "specifications": ["..."],
      "imageUrls": ["https://..."],
      "rating": 4.5,
      "ratingCount": 1234,
      "productUrl": "https://www.flipkart.com/...",
      "isAvailable": true,
      "lastScrapedAt": "2026-09-21T00:00:00.000Z",
      "lastSeenAt": "2026-09-21T00:00:00.000Z",
      "createdAt": "2026-09-21T00:00:00.000Z",
      "updatedAt": "2026-09-21T00:00:00.000Z"
    }
  ]
}
```

An empty page returns `200` with `data: []`. Database or query failures return status `500`:

```json
{
  "message": "Internal server error"
}
```

The response does not include a total count, current page, page size, or `hasNextPage`. A frontend can detect the end of the list when the returned item count is less than the requested `size`, but this is only a convention and not an explicit backend contract.

## Data Contracts

### Product

Products are stored in the `Product` collection. `source` and `sourceProductId` are intended to uniquely identify a product within a source. The current unique index is `{ source: 1, sourceProductId: 1 }`.

Fields exposed by `GET /product`:

- `source`: currently `flipkart`.
- `sourceProductId`: source-site product identifier.
- `title`: product title.
- `brand`: currently normalized to `Apple`.
- `category`: normalized to `iPhone`, `iPad`, or `MacBook`.
- `specifications`: string array.
- `imageUrls`: image URL array.
- `rating`: number from 0 to 5 when available.
- `ratingCount`: integer, default `0`.
- `productUrl`: source product URL.
- `isAvailable`: current availability flag.
- `lastScrapedAt`, `lastSeenAt`: scrape timestamps.
- `createdAt`, `updatedAt`: Mongoose timestamps.

### Offer

Offers are stored in the `Offer` collection and are not exposed by an HTTP route yet. They contain `sourceProductId`, `source`, `sellingPrice`, `originalPrice`, `discountPercent`, `isAvailable`, and `checkedAt`, plus Mongoose timestamps.

Prices are normalized to numbers by stripping non-numeric characters. Missing or unparsable values become `0`.

### Price history

The `PriceHistory` model exists but is not currently written by the scrape flow and has no HTTP endpoint. Do not build a frontend price-history screen against this model until an API is added.

## Frontend Integration Pattern

Use a small API client so the backend URL and error handling are centralized:

```ts
const API_BASE_URL = "http://localhost:3000";

export async function getProducts(page: number, size: number) {
  const response = await fetch(
    `${API_BASE_URL}/product?page=${page}&size=${size}`
  );

  if (!response.ok) {
    throw new Error(`Product request failed: ${response.status}`);
  }

  return response.json() as Promise<{
    message: string;
    data: Product[];
  }>;
}

export async function runScrape() {
  const response = await fetch(`${API_BASE_URL}/scrape`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Scrape request failed: ${response.status}`);
  }

  return response.json();
}
```

Recommended UI states:

- Initial product loading: show a loading state while `GET /product` is pending.
- Empty results: show an empty state when `data.length === 0`.
- Scrape running: show a pending state and prevent duplicate `POST /scrape` requests.
- Scrape completed: refresh the product list after a successful scrape.
- Partial scrape failures: inspect each `result` item and show a summary instead of treating the entire response as failed.
- Network or server error: show a retry action; do not assume the `error` payload has a stable shape.
- Product links: open `productUrl` as an external link and treat it as nullable at the scraping boundary, even though the Mongo schema marks it required.

## Operational and Integration Risks

- Flipkart selectors are build-generated class names and can change without notice. Scraping can return an empty result even while the backend is healthy.
- The current scrape route hardcodes an iPhone search and does not honor frontend search controls.
- There is no authentication, so any reachable client can trigger a potentially expensive scrape.
- CORS is open to all origins and should be restricted before production deployment.
- The server listens on port `3000` unconditionally; there is no `PORT` environment variable yet.
- The backend does not expose offers or price history, despite having models for both.
- Product pagination has no server-side validation or metadata.
- Error response formats differ between routes (`error` versus `message`).
- The scraper depends on Chromium being installed and on the current Flipkart DOM structure.
- The scrape route logs database and scraper details to the server console; do not expose those logs as a frontend contract.

## Change Checklist for Future API Work

When adding or changing an endpoint:

1. Update the route implementation under `src/feature/`.
2. Validate query parameters and request bodies at the route boundary.
3. Keep success and error response shapes explicit and consistent.
4. Update this document with method, path, parameters, status codes, and examples.
5. Add or update a frontend API client function and loading/error handling.
6. Run `npm run check` and `npm run build` before integration testing.
