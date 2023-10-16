const fetch = require("node-fetch");

exports.getLocation = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Latitude, longitude, and API key are required." });
  }

  const apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${process.env.LOCATION_API_KEY}`;

  fetch(apiUrl, { method: "GET" })
    .then((response) => response.json())
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      console.error("Error:", error);
      res
        .status(500)
        .json({ message: "An error occurred while fetching location data." });
    });
};
