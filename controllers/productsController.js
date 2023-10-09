//posting a Product
require("dotenv").config();
const { v4 } = require("uuid");
const database = require("../config/database");
const fs = require("fs-extra");
const cloudinary = require("cloudinary").v2;

//POSTING A Product

exports.postProduct = (req, res, next) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const ProductId = v4();
    var date = new Date();
    const {
      productName,
      quantity,
      productPrice,
      productDescription,
      category,
      seller_id,
      productStatus,
      image,
    } = req.body;

    console.log(req.body);

    var createProduct = `INSERT INTO all_products (
    product_id,
        seller_id,
        item_name,
        item_description,
        item_price,
        item_affiliate_price,
        item_quantity,
        item_category,
        status,
        created_at,
        updated_at,
        verified) VALUES?`;
    var values = [
      [
        ProductId,
        seller_id,
        productName,
        productDescription,
        productPrice,
        0,
        quantity,
        category,
        productStatus,
        date,
        date,
        "TRUE",
      ],
    ];

    database.query(createProduct, [values], (err, result) => {
      if (err) throw err;
      console.log(result);
    });
    // image.forEach(async (item, i) => {
    //   const result = await cloudinary.uploader.upload(item, {
    //     folder: "products",
    //     // width: 300,
    //     // crop: "scale"
    //   });
    //   var saveImage = `INSERT INTO all_images (
    //     product_id,
    //         image_path,
    //         product_name) VALUES?`;
    //   var values = [[ProductId, result.secure_url, productName]];
    //   database.query(saveImage, [values], (err, result) => {
    //     if (err) throw err;
    //     res.sendStatus(200);
    //     // res.send({ data: result, status: "success" });
    //     console.log(result);
    //   });
    // });
    const uploadPromises = image.map(async (item) => {
      const result = await cloudinary.uploader.upload(item, {
        folder: "products",
      });
      var saveImage = `INSERT INTO all_images (
        product_id,
            image_path,
            product_name) VALUES?`;
      var values = [[ProductId, result.secure_url, productName]];

      return new Promise((resolve, reject) => {
        database.query(saveImage, [values], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });

    Promise.all(uploadPromises)
      .then(() => {
        // Send response once all uploads and queries are complete
        // res.sendStatus(200);
        res.send({ status: "success" });
      })
      .catch((error) => {
        console.error(error);
        // Handle any errors here and possibly send an error response
      });
  } catch (e) {
    console.log(e);
  }
}; 

// Get all Products
exports.getAllProducts = async (req, res, next) => {
  try {
    const query = "SELECT * FROM all_products";
    database.query(query, (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no Products" });
      } else {
        const allGoods = [];

        // Create a function to fetch images for a product
        const fetchImagesForProduct = (productId) => {
          return new Promise((resolve, reject) => {
            const query = "SELECT * FROM all_images WHERE product_id=?";
            database.query(query, [productId], (err, images) => {
              if (err) {
                reject(err);
              } else {
                resolve(images);
              }
            });
          });
        };

        // Use Promise.all to fetch images for all products
        const output = result.map((item, i) => {
          return fetchImagesForProduct(item.product_id)
            .then((images) => {
              // Handle the images for each product here
              console.log(images);
              allGoods.push({ product: item, images: images });
            })
            .catch((err) => {
              console.error(err);
            });
        });

        // Wait for all promises to resolve
        Promise.all(output)
          .then(() => {
            // All queries are complete, and images are collected in allGoods array
            console.log(allGoods);
            res.status(200).json({ Goods: allGoods });
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get a specific Product by ID
exports.getProductById = (req, res, next) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM all_products WHERE product_id=?";
    console.log(id);
    database.query(query, [id], (err, result) => {
      if (err) throw err;
      console.log(result);
      const getImage = "SELECT * FROM all_images WHERE product_id=?";
      database.query(getImage, [id], (err, resultImg) => {
        if (err) throw err;
        res.status(200).json({ data: result, image: resultImg });
      });
    });
  } catch (err) {
    next(err);
  }
};
// Get a specific Product by Seller ID
exports.getSellersProducts = (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const query = "SELECT * FROM all_products WHERE seller_id=?";
    database.query(query, [id], (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no Products" });
      } else {
        const allGoods = [];

        // Create a function to fetch images for a product
        const fetchImagesForProduct = (productId) => {
          return new Promise((resolve, reject) => {
            const query = "SELECT * FROM all_images WHERE product_id=?";
            database.query(query, [productId], (err, images) => {
              if (err) {
                reject(err);
              } else {
                resolve(images);
              }
            });
          });
        };

        // Use Promise.all to fetch images for all products
        const output = result.map((item, i) => {
          return fetchImagesForProduct(item.product_id)
            .then((images) => {
              // Handle the images for each product here
              // console.log(images);
              allGoods.push({ product: item, images: images });
            })
            .catch((err) => {
              console.error(err);
            });
        });

        // Wait for all promises to resolve
        Promise.all(output)
          .then(() => {
            // All queries are complete, and images are collected in allGoods array
            console.log(allGoods);
            res.status(200).json({ Goods: allGoods });
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update a Product
exports.updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { name, availability, price, quantity, expirationDate, category } =
    req.body;
  const date = new Date();
  try {
    var query = `UPDATE all_products SET name = ${name}, price=${price}, quantity=${quantity} WHERE product_id = '${id}';`;
    database.query(query, (err, result) => {
      if (err) throw err;
      res.status(200).json({ message: "data updated", result: result });
    });
  } catch (err) {
    next(err);
  }
};

//delete Product
exports.deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Delete the image from Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const val = await cloudinary.uploader.destroy(id);

    // Delete the product record from the database
    var deleteQuery = `DELETE FROM all_products WHERE product_id = '${id}'`;
    database.query(deleteQuery, (err, productDeleteResult) => {
      if (err) {
        console.error(err); // Log the error to the console
        res.status(500).send({ message: "An error occurred" });
      } else {
        console.log(productDeleteResult);

        // Delete image records associated with the product from the database
        var deleteImgQuery = `DELETE FROM all_images WHERE product_id = '${id}'`;
        database.query(deleteImgQuery, (err, imgDeleteResult) => {
          if (err) {
            console.error(err); // Log the error to the console
            res.status(500).send({ message: "An error occurred" });
          } else {
            console.log(imgDeleteResult);

            // Send the success response once all operations are completed
            res.send({ message: "Product deleted" });
          }
        });
      }
    });
  } catch (err) {
    next(err);
  }
};
