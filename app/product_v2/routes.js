const router = require('express').Router();
const Product = require('./model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({dest: 'uploads'});

// Endpoint untuk membuat produk baru
router.post('/product', upload.single('image'), async (req, res) => {
  try {
    const { users_id, name, price, stock, status } = req.body;
    const image = req.file;
    if (!image) {
      res.status(400).json({ success: false, message: 'Image file is required' });
      return;
    }
    const target = path.join(__dirname, '../../uploads', image.originalname);
    fs.renameSync(image.path, target);
    const product = await Product.create({
      users_id,
      name,
      price,
      stock,
      status,
      image_url: `http://localhost:3000/public/${image.originalname}`
    });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint untuk mendapatkan semua produk
router.get('/product', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint untuk mendapatkan detail produk berdasarkan ID
router.get('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
    } else {
      res.json({ success: true, data: product });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint untuk mengupdate produk berdasarkan ID
router.put('/product/:id', upload.single('image'), async (req, res) => {
    try {
      const { id } = req.params;
      const { users_id, name, price, stock, status } = req.body;
      const image = req.file;
  
      let updatedFields = {
        users_id,
        name,
        price,
        stock,
        status
      };
  
      if (image) {
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target);
        updatedFields.image_url = `http://localhost:3000/public/${image.originalname}`;
      }
  
      const [affectedRows] = await Product.update(updatedFields, {
        where: { id }
      });
  
      if (affectedRows === 0) {
        res.status(404).json({ success: false, message: 'Product not found' });
      } else {
        res.json({ success: true, message: 'Product updated successfully' });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });  

// Endpoint untuk menghapus produk berdasarkan ID
router.delete('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
    } else {
      await product.destroy();
      res.json({ success: true, message: 'Product deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
