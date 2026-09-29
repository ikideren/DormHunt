# DormHunt

All-in-One Student Housing Marketplace & Roommate Matching Platform

## About DormHunt

DormHunt is a web-based two-sided marketplace platform specifically designed to solve the fragmentation of student accommodation in Indonesia. The platform integrates three main pillars into a single ecosystem: verified dorm and apartment searches, roommate matching based on lifestyle preferences, and real-time communication between students and property owners.

This project was developed as part of the Student Creativity Program in Constructive-Creative Ideas (PKM-KC) by a team of Computer Science students at Bina Nusantara University.

## Key Features

1. Student Portal & Property Discovery
- Interactive Search & Filter: Search properties by location, type, price range, and facilities (AC, WiFi, Parking, Security).
- Property Comparison: Side-by-side comparison feature to evaluate pricing, distance to campus, room size, and amenities.
- Roommate Matching System: Dedicated matching system for students based on university, budget, gender, and lifestyle habits.
- Saved Favorites: Save a list of preferred properties for later review.

2. Owner Portal
- Dashboard & Analytics: Monitor total views, inquiries, confirmed bookings, conversion rates, weekly trend graphs, and student university demographics.
- Property Management: Manage property listings (active/inactive status, add new listings, edit details).
- Messaging & Inquiries: Interactive inbox equipped with quick response templates to reply to prospective tenants.

3. Admin Panel
- Dashboard Overview: Monitor overall user statistics, active listings, pending reports, and monthly revenue.
- User Management: Manage student and property owner accounts (verification, pending status, or banned).
- Listing Moderation: Curate and moderate new property listings before they go live (approve, reject, flag).
- Reports & Complaints: Handle grievances and review reports regarding false content or potential rental scams.

## Tech Stack & Architecture

DormHunt uses a Modular Monolithic Architecture to maintain development efficiency for a small team:
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Go (Golang), Gin-Gonic Web Framework
- Database & BaaS: PostgreSQL via Supabase

## Project Structure

DormHunt/
├── frontend/
├── backend/
├── database/
├── docs/
└── README.md

## Getting Started Locally

1. Clone the repository:
   git clone https://github.com/ikideren/DormHunt.git
   cd DormHunt

2. Setup Backend:
   cd backend
   go mod download
   go run main.go

3. Setup Frontend:
   cd ../frontend
   npm install
   npm run dev

## Team

Developed by Group-1 L001 - Computer Science Binus University:
- Devon Nicholas – Backend & Database
- Finley Septhian Darma – Backend & UI/UX
- Klaus Anson – UI/UX & Frontend
- Darren Christian Pramana – Frontend
- Alexander Chandra – Frontend
- Faculty Advisor: Alvina Aulia, S.Kom., M.T.I.