const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'some-folder-name',
    format: async(req, file) => 'png',
    public_id: (req, file) => 'computed-filename-using-request',
  },
});

const parser = multer({ storage: storage });

module.exports = {
  parser,
  storage
}