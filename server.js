const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000; // Port provided by environment or fallback to 5000 locally
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

app.use(cors());
app.use(express.json());

// Route to fetch news
app.get('/news', async (req, res) => {
  const { keyword = '', page = 1, category = '', country = '', language = '' } = req.query;
  const articlesPerPage = 10;

  try {
    const endpoint = category ? 'https://gnews.io/api/v4/top-headlines' : 'https://gnews.io/api/v4/search';
    const response = await axios.get(endpoint, {
      params: {
        q: keyword || 'latest',
        token: GNEWS_API_KEY,
        lang: language || 'en',
        max: articlesPerPage,
        page: page,
        country: country || '',
        category: category || '',  // Use this parameter if the endpoint supports it
      },
    });

    const news = response.data;
    res.json({
      currentPage: page,
      articles: news.articles,
      totalArticles: news.totalArticles,
      totalPages: Math.ceil(news.totalArticles / articlesPerPage),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching news' });
  }
});

// Listen to the PORT provided by the environment
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
