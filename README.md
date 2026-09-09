# MUSE

## Support what inspires you.

MUSE is a full-stack creator support platform built with Next.js. It allows users to discover creators, support their work, track their support history, and optionally become creators themselves.

The project started as a creator-focused application and gradually evolved into a two-sided platform with separate supporter and creator experiences while maintaining a single authentication flow.

The primary goal of the project was not just to build the interface, but to understand how authentication, databases, payments, user roles, and application logic connect in a real-world web application.

## Features

### Authentication and User Flow

* Single authentication flow for all users
* Users initially join the platform as supporters
* Any user can optionally become a creator from their dashboard
* Creators can deactivate their creator status
* Role-based functionality without maintaining separate login systems
* Authentication handled using NextAuth

### Creator Discovery

* Browse available creators on the platform
* Search creators by name or username
* Public creator pages for active creators
* Seeded demo creators for exploring the platform

### Creator Support and Payments

* Razorpay payment gateway integration
* Payment order creation
* Payment verification
* Successful payment recording
* Supporter and creator relationships stored with each payment
* Users cannot support themselves
* Validation for incomplete creator payment configurations

The payment flow follows the general process of creating a payment order, completing the payment, verifying the payment on the server, and recording the successful transaction.

> Note: The current payment integration is configured for demonstration and testing purposes.

### Dashboard

The dashboard changes based on whether a user is a supporter or creator.

Supporters can:

* Manage their profile
* View their support history
* Activate their creator account

Creators can:

* Manage their profile
* Access their public creator page
* View received support and payment records
* Manage their creator status

## Demo Creator Data

To make the platform easier to explore, MUSE includes demo creators instead of requiring every creator profile to be created manually.

The workflow involved:

1. Processing a YouTube creator dataset using Python
2. Curating relevant creator information
3. Creating a structured dataset for the application
4. Seeding creator records into MongoDB
5. Marking demo creators separately from regular users

Demo creators are stored with fields such as:

```text
isCreator: true
isDemoCreator: true
```

This keeps demo data distinguishable from real users while allowing both to use the same platform structure.

## Tech Stack

### Frontend

* Next.js
* React
* Tailwind CSS

### Authentication

* NextAuth
* GitHub OAuth

### Backend

* Next.js Server Actions
* Next.js API Routes
* Node.js

### Database

* MongoDB
* Mongoose

### Payments

* Razorpay

### Data Processing

* Python

### Deployment

* Vercel
* MongoDB Atlas

## Project Structure

The application is built using the Next.js App Router.

A simplified representation of the project flow is:

```text
User
 │
 ├── Authentication
 │
 ├── Discover Creators
 │      │
 │      └── View Creator Profile
 │
 ├── Support Creator
 │      │
 │      ├── Create Payment Order
 │      ├── Complete Payment
 │      ├── Verify Payment
 │      └── Record Transaction
 │
 └── Dashboard
        │
        ├── Support History
        │
        └── Become a Creator
                │
                ├── Public Creator Page
                └── Received Payments
```

The core idea behind the user system is simple:

```text
One account
One authentication flow
Optional creator activation
```

## Security Considerations

Sensitive credentials such as payment secrets are handled on the server side and should not be exposed to the client.

Environment variables are used for configuration values such as:

* MongoDB connection strings
* Authentication secrets
* OAuth credentials
* Payment gateway credentials

Real credentials should never be committed to the repository.

## Getting Started

This project is built with Next.js and was bootstrapped using `create-next-app`.

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm, yarn, pnpm, or bun
* MongoDB database access

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

### 2. Navigate to the Project Directory

```bash
cd muse
```

### 3. Install Dependencies

Using npm:

```bash
npm install
```

Alternatively, you can use yarn, pnpm, or bun depending on your preferred package manager.

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory of the project.

Example configuration:

```env
MONGODB_URI=your_mongodb_connection_string

AUTH_SECRET=your_auth_secret

GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

NEXTAUTH_URL=http://localhost:3000

NEXT_PUBLIC_URL=http://localhost:3000
```

Configure your Razorpay credentials according to your payment setup.



### 5. Run the Development Server

Using npm:

```bash
npm run dev
```

Or using other package managers:

```bash
yarn dev
```

```bash
pnpm dev
```

```bash
bun dev
```

Open `http://localhost:3000` in your browser to view the application.

The application supports automatic updates during development when project files are modified.

## Development

The application uses the Next.js App Router.

You can start exploring the project by modifying files inside the `app` directory.

For example, the main application page can be modified through:

```text
app/page.js
```

Changes made during development are automatically reflected in the browser.

The project also uses `next/font` for optimized font loading.


## Live Demo

Live Demo: https://muse-five-black.vercel.app/

