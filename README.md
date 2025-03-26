# 🛒 Cart App

Full-stack shopping cart app built with **Ruby on Rails** (API-only) and **React** (TypeScript).

---

## 🧱 Stack

- **Backend**: Ruby on Rails 7 (API-only)
- **Frontend**: React 19 + TypeScript (Create React App)
- **Styling**: Custom CSS
- **Testing**: Jest (React)
- **Data persistence**: localStorage (cart), PostgreSQL (orders)

---

## 🚀 How to Run

### 1. Backend (Rails API)

```bash
cd cart_app
bundle install
rails db:create db:migrate db:seed
rails s
```

Runs on: http://localhost:3000

### 2. Frontend (React)

```bash
cd cart_ui
npm install
npm start
```

Runs on: http://localhost:3001

---

## ✅ Features

- 📦 Product catalog fetched from API
- 🛒 Add/remove items from cart
- 💾 Cart is saved in localStorage
- 🔁 Real-time discounts:
  - **GR1**: Buy 1 Get 1 Free
  - **SR1**: Bulk price if 3+ units
  - **CF1**: 2/3 price if 3+ units
- 🧾 Checkout summary with itemized prices and discounts
- 🧪 Unit tests for pricing logic

---

## 🧪 Tests

```bash
cd cart_ui
npm test
```

Tested discount rules for basket combinations:

- `GR1,GR1` → 3.11 €
- `SR1,SR1,GR1,SR1` → 16.61 €
- `GR1,CF1,SR1,CF1,CF1` → 30.57 €

---

## 📁 Folder Structure

```
cart_project/
├── cart_app/     # Rails API backend
│   └── app/models, controllers, routes, etc.
├── cart_ui/      # React frontend
│   └── src/components, utils, tests, etc.
└── README.md     # You're here
```

---

## 💡 Notes

- CORS is configured to allow requests from `localhost:3001`
- Rails orders are saved to the DB (basic Order model with items JSON)
- Easily extendable for new pricing rules (modular engine in `pricingEngine.ts`)

---

© Alex Arroyo 2025
