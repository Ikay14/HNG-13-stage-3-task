Country Currency & Exchange Rate API
A RESTful API built with NestJS and Prisma that fetches country data and exchange rates, caches them in MySQL, and provides CRUD operations.

Tech Stack
NestJS - Backend framework
Prisma - ORM for POSTGRESQL
POSTGRESQL - Database
Canvas - Image generation
Axios - HTTP requests
Prerequisites
Node.js 18+
POSTGRESSQL database
Railway account (for hosting)
Local Setup
1. Clone the repository
bash
git clone <your-repo-url>
cd country-currency-api
2. Install dependencies
bash
npm install
3. Set up environment variables
Create a .env file in the root directory:

env
DATABASE_URL="mysql://user:password@localhost:3306/country_db"
PORT=3000
4. Set up the database
bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database (for development)
npm run prisma:push

# OR run migrations (for production)
npm run prisma:migrate
5. Run the application
bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
The API will be available at http://localhost:3000

API Endpoints
Refresh Countries Data
http
POST /countries/refresh
Fetches countries and exchange rates from external APIs and caches them.

Response:

json
{
  "message": "Countries refreshed successfully",
  "timestamp": "2025-10-22T18:00:00.000Z"
}
Get All Countries
http
GET /countries
GET /countries?region=Africa
GET /countries?currency=NGN
GET /countries?sort=gdp_desc
Response:

json
[
  {
    "id": 1,
    "name": "Nigeria",
    "capital": "Abuja",
    "region": "Africa",
    "population": 206139589,
    "currency_code": "NGN",
    "exchange_rate": 1600.23,
    "estimated_gdp": 25767448125.2,
    "flag_url": "https://flagcdn.com/ng.svg",
    "last_refreshed_at": "2025-10-22T18:00:00.000Z"
  }
]
Get Single Country
http
GET /countries/:name
Example: GET /countries/Nigeria

Delete Country
http
DELETE /countries/:name
Response:

json
{
  "message": "Country deleted successfully"
}
Get Status
http
GET /status
Response:

json
{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-22T18:00:00.000Z"
}
Get Summary Image
http
GET /countries/image
Returns a PNG image with summary statistics.

Railway Deployment
1. Create a Railway project
Go to Railway.app
Click "New Project"
Select "Deploy from GitHub repo"
Connect your repository
2. Add MySQL database
Click "New" → "Database" → "Add MySQL"
Railway will automatically create a DATABASE_URL variable
3. Set environment variables
In your Railway project settings, add:

PORT=3000
The DATABASE_URL is automatically provided by Railway's MySQL service.

4. Configure build settings
Railway auto-detects the build command. Ensure your package.json has:

json
{
  "scripts": {
    "build": "prisma generate && nest build",
    "start:prod": "node dist/main"
  }
}
5. Deploy
Railway will automatically deploy on every push to your main branch.

:

bash
# Refresh data first
curl -X POST https://your-app.railway.app/countries/refresh

# Get all countries
curl https://your-app.railway.app/countries

# Get status
curl https://your-app.railway.app/status

# Get image
curl https://your-app.railway.app/countries/image --output summary.png
Error Responses
400 Bad Request
json
{
  "error": "Validation failed",
  "details": {
    "currency_code": "is required"
  }
}
404 Not Found
json
{
  "error": "Country not found"
}
503 Service Unavailable
json
{
  "error": "External data source unavailable",
  "details": "Could not fetch data from restcountries.com"
}
500 Internal Server Error
json
{
  "error": "Internal server error"
}
Project Structure
src/
│   ├── app.controller.ts    # API endpoints
│   ├── app.service.ts       # Business logic
│   ├── app.module.ts        # Module definition
├── app.module.ts                # Root module
└── main.ts                      # Application entry point

prisma/
└── schema.prisma                # Database schema
Notes
An HNG 13 stage 2 TASK
Exchange rates are fetched from USD base
GDP calculation: population × random(1000-2000) ÷ exchange_rate
Countries without currencies store null for exchange rate and GDP
Image is regenerated on every refresh
Case-insensitive country name matching for GET and DELETE
License
MIT

