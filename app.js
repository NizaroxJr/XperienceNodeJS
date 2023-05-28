const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 3000;

// MySQL connection configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "nizar",
  password: "@Data20120",
  database: "xperience",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to the database.");
});

// Set up middleware to parse JSON requests
app.use(express.json());

// Define API endpoints
app.get("/reviews", (req, res) => {
  // Fetch all reviews from the database
  const query = "SELECT * FROM reviews";

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Failed to fetch reviews from the database." });
    } else {
      // Modify the fetched reviews data
      const modifiedReviews = results.map((review) => ({
        id: review.id,
        appID: review.appID,
        appStoreName: review.appStoreName,
        reviewDate: review.reviewDate,
        rating: review.rating,
        version: review.version,
        countryName: review.countryName,
        reviewHeading: review.reviewHeading,
        reviewText: review.reviewText,
        reviewUserName: review.reviewUserName,
      }));

      res.json({ reviews: modifiedReviews });
    }
  });
});

app.get("/reviews/filter", (req, res) => {
  const { appID, appStoreName, rating, countryName } = req.query;

  // Prepare the filter query based on the provided parameters
  let filterQuery = "SELECT * FROM reviews WHERE 1=1";

  if (appID) {
    filterQuery += ` AND appID = '${appID}'`;
  }

  if (appStoreName) {
    filterQuery += ` AND appStoreName = '${appStoreName}'`;
  }

  if (rating) {
    filterQuery += ` AND rating = ${rating}`;
  }

  if (countryName) {
    filterQuery += ` AND countryName = '${countryName}'`;
  }

  // Execute the filter query
  db.query(filterQuery, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to filter reviews." });
    } else {
      // Modify the fetched reviews data
      const modifiedReviews = results.map((review) => ({
        id: review.id,
        appID: review.appID,
        appStoreName: review.appStoreName,
        reviewDate: review.reviewDate,
        rating: review.rating,
        version: review.version,
        countryName: review.countryName,
        reviewHeading: review.reviewHeading,
        reviewText: review.reviewText,
        reviewUserName: review.reviewUserName,
      }));

      res.json({ reviews: modifiedReviews });
    }
  });
});

app.get("/reviews/search", (req, res) => {
  const { query } = req.query;

  // Prepare the search query
  const searchQuery = `SELECT * FROM reviews WHERE reviewHeading LIKE '%${query}%' OR reviewText LIKE '%${query}%'`;

  // Execute the search query
  db.query(searchQuery, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to search reviews." });
    } else {
      // Modify the fetched reviews data
      const modifiedReviews = results.map((review) => ({
        id: review.id,
        appID: review.appID,
        appStoreName: review.appStoreName,
        reviewDate: review.reviewDate,
        rating: review.rating,
        version: review.version,
        countryName: review.countryName,
        reviewHeading: review.reviewHeading,
        reviewText: review.reviewText,
        reviewUserName: review.reviewUserName,
      }));

      res.json({ reviews: modifiedReviews });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
