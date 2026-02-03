# SecureMyAir Admin (Red Apple Admin)

Admin dashboard for SecureMyAir  manage customers, machines, installations, inspections, and reporting.

## Tech Stack

- **React 18** (Create React App)
- **Material UI (MUI)**  UI components and theming
- **React Router**  routing
- **ApexCharts**  charts and reporting
- **Axios**  API requests
- **jsPDF**  PDF export

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Environment

Copy `.env.example` to `.env` and set your backend URL:

```bash
# .env
REACT_APP_BACKEND_URL=http://localhost:8000
```

- **Development:** Use `http://localhost:8000` or your local API URL.
- **Production:** Set `REACT_APP_BACKEND_URL` to your API host (e.g. `https://api.securemyair.com`) when building.
- For local overrides without committing, use `.env.local` (it is gitignored).

## Getting Started

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm start
```

Opens [http://localhost:3000](http://localhost:3000). The app reloads on changes and shows lint errors in the console.

### Build for production

```bash
npm run build
```

Output goes to the `build` folder. The build is minified and ready to deploy.

### Run tests

```bash
npm test
```

Launches the test runner in watch mode.

## Project Structure

| Area | Description |
|------|-------------|
| **Dashboard** | Overview and metrics |
| **Customers** | Customer list, add/edit, machine assignment |
| **Machines** | Machine management and details |
| **Installation** | Installation workflow and steps |
| **Inspection** | Inspections and images |
| **Reportings** | Reports, AQI, trends, charts |
| **Errors** | Error history and logs |
| **Sensors** | Indoor/outdoor sensors, relays |
| **Display Settings** | Display configuration |
| **Media Library** | Media assets |

## Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)
- [Material UI](https://mui.com/)
