import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Button } from 'react-bootstrap';
import SidebarFilter from './SidebarFilter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import { CSVLink } from 'react-csv';

const NewsAndBlogs = () => {
  const [articles, setArticles] = useState([]);
  const [filters, setFilters] = useState({
    searchQuery: '',
    page: 1,
    pageSize: 4,
    authorFilter: '',
    dateRange: { startDate: '', endDate: '' },
    typeFilter: '',
  });
  const [prevFilters, setPrevFilters] = useState(filters);
  const [userPayout, setUserPayout] = useState(0);
  const [darkMode, setDarkMode] = useState(false); // Dark mode state
  const API_KEY = '170a3f60c5a74e6089b3956ffee0a1de';

  // Apply dark mode classes to the body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('bg-dark', 'text-light');
    } else {
      document.body.classList.remove('bg-dark', 'text-light');
    }

    return () => {
      document.body.classList.remove('bg-dark', 'text-light');
    };
  }, [darkMode]);

  // Load filters and payout from localStorage if they exist
  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem('filters'));
    const savedPayout = localStorage.getItem('totalPayout');
    
    if (savedFilters) {
      setFilters(savedFilters);
    }

    if (savedPayout) {
      setUserPayout(Number(savedPayout));
    }
  }, []);

  // Fetch articles based on filters
  const fetchArticles = async () => {
    try {
      const query = filters.searchQuery.trim() || 'technology';
      const params = {
        apiKey: API_KEY,
        q: query,
        from: filters.dateRange.startDate || '',
        to: filters.dateRange.endDate || '',
        sortBy: 'publishedAt',
        pageSize: filters.pageSize,
        page: filters.page,
      };

      if (filters.typeFilter) {
        params.q = filters.typeFilter.toLowerCase();
      }

      const response = await axios.get('https://newsapi.org/v2/everything', { params });
      setArticles(response.data.articles || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Error fetching articles.');
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchArticles();
      localStorage.setItem('filters', JSON.stringify(filters));
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [filters]);

  // Handle clicking on a news article and updating the payout
  const handleArticleClick = (articleUrl) => {
    try {
      const payout = 1;
      const newTotalPayout = userPayout + payout;
      setUserPayout(newTotalPayout);
      localStorage.setItem('totalPayout', newTotalPayout);

      // Redirect to the full article URL
      window.location.href = articleUrl;

      toast.success(`You earned ₹${payout} for this article! Total Payout: ₹${newTotalPayout}`);
    } catch (error) {
      console.error('Error fetching payout for article:', error);
      toast.error('Failed to fetch payout for this article.');
    }
  };

  const resetFilters = () => {
    setFilters(prevFilters);
    localStorage.setItem('filters', JSON.stringify(prevFilters));
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      localStorage.setItem('filters', JSON.stringify(newFilters));
      return newFilters;
    });
  };

  // Generate PDF with total payout only
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Total Payout: ₹${userPayout.toFixed(2)}`, 10, 10);
    doc.save('total-payout.pdf');
  };

  return (
    <div className="container mt-5">
      <Row>
        <Col md={3}>
          <SidebarFilter
            authorFilter={filters.authorFilter}
            setAuthorFilter={(authorFilter) => updateFilter('authorFilter', authorFilter)}
            dateRange={filters.dateRange}
            setDateRange={(dateRange) => updateFilter('dateRange', dateRange)}
            typeFilter={filters.typeFilter}
            setTypeFilter={(typeFilter) => updateFilter('typeFilter', typeFilter)}
          />
        </Col>

        <Col md={9}>
          {/* Dark Mode Button at the Top */}
          <div className="d-flex justify-content-end mb-4">
            <Button variant="dark" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>

          <h1 className="text-center mb-4">News and Blogs</h1>

          <div className="mb-4 text-center">
            <h3>Total Payout: ₹{userPayout.toFixed(2)}</h3>
          </div>

          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search articles..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
            />
          </div>

          <Row>
            {articles.map((article, index) => (
              <Col md={4} key={index}>
                <Card className="mb-4">
                  {article.urlToImage && <Card.Img variant="top" src={article.urlToImage} />}
                  <Card.Body>
                    <Card.Title>{article.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {article.author} | {new Date(article.publishedAt).toLocaleDateString()}
                    </Card.Subtitle>
                    <Card.Text>{article.description}</Card.Text>
                    <Button variant="primary" onClick={() => handleArticleClick(article.url)}>
                      Read More & Earn
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="secondary"
              onClick={() => updateFilter('page', Math.max(filters.page - 1, 1))}
              disabled={filters.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              onClick={() => updateFilter('page', filters.page + 1)}
              className="ms-3"
            >
              Next
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Button variant="warning" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Button variant="success" onClick={generatePDF}>
              Download Payout PDF
            </Button>
            <CSVLink
              data={[{ TotalPayout: `₹${userPayout.toFixed(2)}` }]}
              filename="total-payout.csv"
            >
              <Button variant="info" className="ms-3">
                Download Payout CSV
              </Button>
            </CSVLink>
          </div>
        </Col>
      </Row>

      <ToastContainer />
    </div>
  );
};

export default NewsAndBlogs;
