import  { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminPanel = () => {
  const [articles, setArticles] = useState([]);
  const [payoutValues, setPayoutValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const articlesPerPage = 4;

  // Effect for Dark Mode
  useEffect(() => {
    document.body.classList.toggle('bg-dark', darkMode);
    document.body.classList.toggle('text-light', darkMode);
  }, [darkMode]);

  // Fetch articles data from News API
  useEffect(() => {
    const fetchArticles = async () => {
      const apiKey = '170a3f60c5a74e6089b3956ffee0a1de';
      try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&pageSize=${articlesPerPage}&page=${currentPage}&apiKey=${apiKey}`);
        setArticles(response.data.articles);
        setTotalPages(Math.ceil(response.data.totalResults / articlesPerPage));
      } catch (error) {
        toast.error('Failed to fetch articles.',error);
      }
    };
    fetchArticles();
  }, [currentPage]);

  // Get user data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.email) setUser({ email: storedUser.email });
  }, []);

  // Calculate total payout
  const calculateTotalPayout = () => {
    const total = Object.values(payoutValues).reduce((acc, value) => acc + (parseFloat(value) || 0), 0);
    localStorage.setItem('totalPayout', total.toFixed(2));
    return total.toFixed(2);
  };

  // Handle payout input changes
  const handlePayoutChange = (e, title) => {
    const value = e.target.value;
    if (value === '' || !isNaN(value)) {
      setPayoutValues(prev => ({ ...prev, [title]: value }));
      calculateTotalPayout();
    }
  };

  // Pagination function
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Pie chart data
  const pieChartData = {
    labels: articles.map(article => article.title),
    datasets: [{
      data: articles.map(article => parseFloat(payoutValues[article.title] || 0)),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#C9CBCF'],
      hoverOffset: 4,
    }],
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h1 className="text-center text-md-start">Admin Panel</h1>
        <button className="btn btn-dark mt-3 mt-md-0" onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {user && <h3 className="text-center mb-4">Welcome, {user.email}!</h3>}

      <div className="table-responsive mb-4">
        <table className={`table table-bordered table-striped ${darkMode ? 'table-dark' : ''}`}>
          <thead>
            <tr>
              <th>Article Title</th>
              <th>Payout Rate</th>
              <th>Total Payout</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article, index) => (
              <tr key={index}>
                <td>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className={darkMode ? 'text-light' : ''}>
                    {article.title}
                  </a>
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control w-100"
                    value={payoutValues[article.title] || ''}
                    onChange={(e) => handlePayoutChange(e, article.title)}
                    placeholder="Enter Payout Rate"
                    style={{
                      fontSize: '14px',
                      padding: '8px',
                    }}
                  />
                </td>
                <td>{(parseFloat(payoutValues[article.title] || 0) * 1 || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4>Total Payout: ₹{calculateTotalPayout()}</h4>

      {/* Pie Chart Section */}
      <div className="mt-5 row justify-content-center">
        <div className="col-12 col-md-8">
          <h3 className="text-center mb-4">Total Payout Pie Chart</h3>
          <div className="chart-container" style={{ height: '400px' }}>
            <Pie data={pieChartData} />
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-secondary" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button className="btn btn-secondary" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
