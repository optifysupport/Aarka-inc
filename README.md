# Aarka Inc - Precision Electrical Engineering Portal

A production web application and dynamic catalog for Aarka Inc, an industrial electrical distributor specializing in relay modules, modern architectural lighting, energy-efficient fans, sensors, generators, and precision electrical switchgear.

- **Live Deployment**: https://aarka-inc.vercel.app/
- **Repository**: https://github.com/optifysupport/Aarka-inc

---

## Overview

Aarka Inc is built with high-performance modern web standards, featuring dynamic live catalog management backed by Supabase, custom administrative controls, responsive product filtering, and an automated keep-alive pipeline.

---

## Key Features

- **Dynamic Product Catalog**: Real-time product listing backed by Supabase database, with instant category filtering, price range sorting, and keyword search.
- **Interactive Shopping Cart**: Slide-over drawer cart with real-time quantity adjustments, state persistence, and direct order workflows.
- **Admin Management Portal**: Secure admin portal for product creation, editing, category assignment, offer slots, and best seller toggling with image upload support.
- **Modern Responsive UI**: Clean visual hierarchy, frosted glassmorphism navigation, responsive layouts across mobile, tablet, and desktop screens.
- **Automated Keep-Alive CI/CD**: Scheduled GitHub Actions workflow that executes lightweight REST queries to ensure continuous database and backend availability.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide Icons, Motion
- **Backend & Database**: Supabase (PostgreSQL, Real-Time REST API, Storage)
- **Deployment**: Vercel
- **Automation**: GitHub Actions (Cron Keep-Alive Workflow)

---

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/optifysupport/Aarka-inc.git
   cd Aarka-inc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy the example environment file and add your credentials:
   ```bash
   cp .env.example .env
   ```

   Fill in the required Supabase parameters:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key-here"
   APP_URL="https://aarka-inc.vercel.app"
   ```

4. Start the local development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

---

## Available Scripts

- `npm run dev`: Starts the local Vite development server on port 3000.
- `npm run build`: Generates the optimized production build in the `dist/` directory.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs TypeScript validation checks (`tsc --noEmit`).

---

## Continuous Integration & Keep-Alive Automation

The repository includes a scheduled GitHub Actions workflow located at `.github/workflows/keep-alive.yml`. This workflow runs on a regular 6-hour cron schedule (`0 */6 * * *`) and performs automated health pings to keep the Supabase database compute and production web endpoints active.

### GitHub Repository Secrets

Configure the following secrets under **Settings > Secrets and variables > Actions**:

- `SUPABASE_URL`: Base URL of your Supabase instance.
- `SUPABASE_ANON_KEY`: Public anonymous API key for database access.
- `APP_URL`: Production application URL (`https://aarka-inc.vercel.app`).

---

## Contact & Support

- **Address**: Columbia hospital back side, 5, Maruthi nagar, Bashettihalli, Karnataka 562163
- **Phone**: +91 98443 18555 / +91 90665 58866
- **Email**: aarkainc7@gmail.com
- **Website**: https://aarka-inc.vercel.app/
