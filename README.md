# 🌌 Star Wars Explorer – Technical Documentation

This document outlines the technical guidelines for the **Star Wars Explorer** project, which integrates the [SWAPI](https://www.swapi.tech/) (Star Wars API) with custom data enhancements to display detailed character information, including **pagination** and **real-time search** functionality. The project features a **React frontend** and a **Node.js backend**.

---

## 📖 Overview

### 🎯 Purpose

Build an intuitive UI to explore Star Wars characters using SWAPI data, enhanced with:

* Real-time **search**
* **Pagination**
* **Detailed character view**

### 🛠️ Technologies

* **Frontend**: React + Tailwind CSS
* **Backend**: Node.js + Express.js

  * `axios` for API calls
  * `p-limit` for request throttling
* **API**: [SWAPI](https://www.swapi.tech/) (primary data source), enriched with custom logic

---

## ✨ Key Features

* Display character details:

  * **Name**, **Height**, **Mass**, **Homeworld**, **Species**, **Films**
* Real-time, case-insensitive **search by name**
* **Pagination** with 10 characters per page
* Responsive, dark-themed UI with Tailwind CSS

---

## 🏗️ Architecture

### 🔹 Frontend

* `HomePage` component:

  * Fetches data from backend
  * Manages state using `useState`, `useEffect`
  * Displays characters with **search and pagination controls**
* **LocalStorage**:

  * Caches character data to minimize API calls

### 🔹 Backend

* Express server exposes:

  ```http
  GET /api/characters
  ```
* On startup:

  * Loads and **caches all characters**
  * Adds **retry logic** for rate-limited SWAPI calls
* Enriches character data with:

  * **Homeworld**
  * **Species**
  * **Films**
* Uses `p-limit` for **parallel throttled requests**

---

## 🔁 Data Flow

1. **Frontend** makes a request to:
   `http://localhost:5000/api/characters`

2. **Backend**:

   * Fetches character data from SWAPI
   * Enhances it with homeworld, species, and film details
   * Returns paginated, enriched data to frontend

---

## 🧑‍💻 Implementation Guidelines

### 🌐 SWAPI Integration

* Use `/people` endpoint for listing characters
* Apply **exponential backoff**:

  * Retry up to **5 times**
  * **2000ms** delay between retries

### ⚙️ Custom Enhancements

* **Species inference**:

  * Match character URLs with species data if not directly available
* **Caching**:

  * Store full character list on server startup for performance and consistency

### 📄 Pagination

* 10 characters per page
* Controlled via query parameters:
  `?page=1&search=anakin`

### 🔎 Search

* Case-insensitive filtering of character names
* Handled **server-side** for performance

### 🧱 Error Handling

* Show **partial data** if enrichment fails
* **Log errors** in backend
* Show **user-friendly messages** in frontend

### 🎨 Styling

* Use **Tailwind CSS**
* Follow the dark theme based on provided wireframe
* Ensure **responsive design**

---

## 🚀 Deployment

### ⚙️ Local Setup

1. Start backend:

   ```bash
   node index.js
   # or
   npm run dev
   ```

2. Start frontend:

   ```bash
   npm start
   ```

### 📦 Dependencies

* **Backend**:

  * `express`, `axios`, `cors`, `p-limit`
* **Frontend**:

  * React + Tailwind CSS
* Ensure [SWAPI](https://www.swapi.tech/) is accessible

### 💾 Caching

* **LocalStorage**: Caches characters on frontend
* **In-Memory Cache**: Loaded on server startup
