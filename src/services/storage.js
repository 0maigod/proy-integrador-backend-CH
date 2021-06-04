const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', '..', 'public', 'img'));
    },
    filename: function (req, file, cb) {
        let avatar = `${file.fieldname}-${Date.now()}`;
        req.body.avatar = avatar;
        cb(null, avatar);
    }
});


const upload = multer({ storage: storage });

module.exports =  upload;
