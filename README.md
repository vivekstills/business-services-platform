# Business Services Platform

A modern consultancy platform for business, compliance, tax, licensing, and trademark-related services.

## Problem Statement

Business owners and startups often struggle to find and compare professional services (registrations, filings, compliance, licenses, and legal support) in one place. Information is usually scattered, difficult to navigate, and not optimized for quick decision-making on mobile.

This platform solves that by providing:

- A single, structured service catalog
- Fast navigation across categories and service detail pages
- Clear pricing and enquiry capture flows
- A responsive, mobile-first UI for better accessibility and usability

## Features

- Category-driven services navigation with organized mega menu
- Detailed service pages with:
  - About section
  - Package/pricing information
  - FAQs
  - Enquiry form
- Homepage with quick tools and curated service discovery
- Dedicated trademark search page flow
- Contact/get-in-touch form with service selection
- Persistent floating chat support
- Responsive layouts for desktop and mobile
- Articles/blog section with list and detail routes

## Tech Stack

- **Frontend:** React, TypeScript
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **Animation/UI Motion:** Motion (Framer Motion API)
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Package Manager:** npm

## Setup

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

If needed, configure environment variables in a local `.env` file based on project requirements before running the app.
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/13f639e3-1f74-41e7-b414-6ddea68c2a1e

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
