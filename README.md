# Amazon Premium Storefront

A high-end, responsive Amazon-style e-commerce Product Listing & Detail application. Built using **React (Functional Components + Hooks)**, **React Router**, and vanilla **CSS**, integrated with the **DummyJSON API**.

## 🚀 Setup Instructions

Follow these steps to run the application locally:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Install Dependencies
Run the following command in the root folder to install the project dependencies (including `react-router-dom` and `lucide-react`):
```bash
npm install
```

### 3. Start Development Server
Launch the development server on `http://localhost:5173/`:
```bash
npm run dev
```

### 4. Build for Production
To build the application for production, compile the assets:
```bash
npm run build
```

---

## 💡 Assumptions Made

1. **Client-Side Combined Filtering**: Since the DummyJSON API does not support combined server-side query filters (such as searching, selecting category, limiting price, and selecting brand simultaneously), we retrieve the complete product set (either category-scoped or globally) and execute combined multi-filtering in memory. This delivers a fast, instantaneous filtering experience.
2. **Context-Driven State**: We assume filters should persist when navigating back from the details view. Using a React Context (`FilterContext`) preserves user filter settings, pagination state, and category choices when jumping between paths.
3. **Dynamic Brand Checklist**: The brand checkbox list dynamically shows only the brands available in the *currently selected category*, which matches premium real-world shopping experiences (e.g. you won't see clothing brands when searching for laptops).
4. **Original Price Synthesis**: The API lists prices and discount percentages. The original price is mathematically synthesized from these numbers (`price / (1 - discountPercentage/100)`) to display authentic slashes.

---

## 🏗️ Architectural Decisions

- **Folder Hierarchy**:
  - `src/context/`: Contains the global filter provider.
  - `src/components/`: Houses reusable visual segments (`Header`, `ProductCard`, `Skeleton`).
  - `src/pages/`: Contains page entry points (`ListingPage`, `DetailPage`).
  - `src/index.css`: Houses CSS custom properties, grid layouts, transitions, light/dark definitions, and typography.
- **Vanilla CSS (Design Tokens)**: Tailored CSS custom properties are defined at the `:root` to handle theme toggle states.
- **Glassmorphic Skeletons**: Rather than simple spinner loops, shimmer blocks act as visual cues for layout containers during asynchronous fetches.

---

## 🔮 Future Improvements

If given more time, the following upgrades could be made:

### 🔗 URL-Based Filter Persistence

Store filter values in URL query parameters so users can bookmark, share, and revisit filtered product views without losing their selected filters.

### 📊 Sorting Options

Add sorting capabilities based on:

* Price (Low → High / High → Low)
* Rating
* Product Name (A → Z / Z → A)

This would help users discover products more efficiently.

### 📱 Enhanced Mobile Experience

Further improve the mobile experience by:

* Optimizing the filter drawer
* Refining touch interactions
* Improving layouts for smaller screens

### 🔍 Product Search Suggestions

Display real-time product suggestions as users type in the search bar, allowing faster navigation and product discovery.

### ⚡ Improved Loading States

Enhance user experience with:

* Richer skeleton loaders
* Smooth loading transitions
* Better visual feedback during API requests

