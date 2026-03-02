# 🌸 SereneFocus: Mindful Productivity
**The Intent-Driven Deep Work Sanctuary for the Modern Student.**

### 🏆 Executive Summary
**SereneFocus** is a full-stack productivity ecosystem engineered to solve the "Passive Work" crisis. Unlike generic Pomodoro timers, SereneFocus enforces a **Psychological Feedback Loop**—requiring a "Pre-session Intent" and a "Post-session Reflection". This creates a relational data map of a user's focus patterns, turning a simple clock into a powerful cognitive audit tool.

### 🛠️ The Engineering Stack (Vite + React + Supabase)
As a 3rd-year CSE student, I prioritized **Type Safety**, **Modular Scalability**, and **Real-time Persistence**:
* **Frontend Architecture:** **React.js** with **TypeScript** for robust component-driven development.
* **State Management:** Decoupled business logic into a custom **`useTimer` hook**, preventing UI re-render lags and ensuring 100% timing precision.
* **Styling & UX:** **Tailwind CSS** for a "Soft-Minimalist" design system.
* **Backend & Database:** **Supabase (PostgreSQL)** for secure User Authentication and relational data storage.
* **Build Engine:** **Vite** for optimized HMR (Hot Module Replacement) and production bundling.
  
### 🧠 Core  Features

#### 1. Relational Productivity Mapping

I moved beyond simple `localStorage` to a structured **PostgreSQL schema**. Every focus session is a relational record linked to the User ID, storing foreign-key associations with qualitative 'Intent' and 'Reflection' strings. This allows the "History" module to fetch and display personalized focus trends.

#### 2. The "Zero-Scroll" Viewport Strategy

To maximize deep work, I implemented a **strictly constrained viewport** using `h-screen` and `overflow-hidden`. This ensures the "Focus Zone" is always centered, eliminating the cognitive distraction of scrolling.

#### 3. State-Driven Neuro-Feedback

The application utilizes a state-driven theme engine. Upon session completion (00:00), the DOM background transitions to a **Soft Green (#f0fff4)**. This provides immediate neurological reinforcement, signaling a successful focus cycle.

#### 4. Integrated Insights & History

* **🔥 Pre Intent and Post Intent:** Real-time persistence of consistency to gamify focus.
* **📊 Weekly Stats:** A high-level view of focus minutes accumulated over the current week.
* **📅 Interactive History:** A calendar-based audit trail to revisit past session goals and outcomes.

---

### 📂 Repository Structure

* **`/src/components`**: Modular UI components (Timer, Stats, Profile).
* **`/src/hooks`**: Custom React hooks for business logic and Supabase integration.
* **`/src/services`**: Infrastructure layer for database client initialization.
* **`/supabase`**: Database migration and security configuration files.

---

### Developed by-
**Khushi Raghuwanshi**


---

### 🕒 Final Links

* **GitHub Repository:** `https://github.com/KhushiRaghuwanshi20/SereneFocus`
* **Live Production Demo:** 


