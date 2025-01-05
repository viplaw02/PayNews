# Responsive News & Payout Dashboard

A modern, responsive dashboard that integrates news articles and payout management features. This dashboard displays top news headlines fetched from the **NewsAPI** and allows users to input payout rates for each article. The dashboard also includes a **pie chart** for total payouts, **dark mode** support, and **pagination** for articles, providing an intuitive and user-friendly experience.

---

## Features

- **Responsive Design:** Fully responsive and mobile-friendly layout.
- **News API Integration:** Displays top news articles using the [NewsAPI](https://newsapi.org/).
- **Payout Management:** Allows users to enter payout rates for each article and automatically calculates the total payouts.
- **Pie Chart:** A pie chart visualizes the distribution of payouts for each article.
- **Pagination:** Navigate through multiple pages of news articles seamlessly.
- **Dark Mode:** Toggle between dark and light themes for improved user experience.
- **User Authentication:** Displays the logged-in user’s email from localStorage.
- **State Management:** Uses React’s `useState` and `useEffect` hooks to manage local component state.

---

## Tech Stack

- **Frontend:** React.js, Bootstrap
- **Charting:** Chart.js (for pie chart visualization)
- **API:** [NewsAPI](https://newsapi.org/) to fetch the latest news headlines
- **Styling:** Bootstrap CSS
- **State Management:** Local state using React hooks (`useState`, `useEffect`)

---

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/responsive-news-payout-dashboard.git
    cd responsive-news-payout-dashboard
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the development server:**

    ```bash
    npm start
    ```

4. **Open your browser** and navigate to:

    ```bash
    http://localhost:3000
    ```

---

## Environment Variables

You will need to create a **NewsAPI key** for the app to fetch news articles. Follow these steps:

1. Go to [NewsAPI](https://newsapi.org/) and sign up.
2. Create an API key.
3. Replace the placeholder API key in the `AdminPanel` component:

    ```javascript
    const apiKey = 'your-api-key';
    ```

---

## Folder Structure

```plaintext
/src
  /components
    AdminPanel.js       // Main dashboard component that manages news articles, payout inputs, and pie chart.
    PayoutChart.js      // Pie chart component for visualizing total payouts.
    Pagination.js       // Pagination component for navigating through news articles.
    Header.js           // Header with dark mode toggle button and user info.
  App.js                // Main app component that integrates all components.
  index.js              // Entry point for React app.
  /assets
    /images             // Any images used in the app.
  /styles
    styles.css          // Custom styles (if any).
