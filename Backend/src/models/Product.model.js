const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    images: {
      type: [String],
      required: [true, 'At least one image URL is required'],
      validate: {
        validator: function(v) {
          return v && v.length > 0 && v.length <= 7 && v.every(url => /^(https?:\/\/)([\w\-]+\.)+[\w\-]+(\/\S*)?$/.test(url));
        },
        message: 'A product must have between 1 and 7 valid image URLs',
      },
    },
    image: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

productSchema.pre('validate', function(next) {
  if (this.name && (this.isModified('name') || !this.slug)) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
