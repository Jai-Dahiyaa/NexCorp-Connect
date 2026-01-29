import multer from "multer";
import path from "path";
import { fileURLToPath } from "url"; // __dirname equivalent in ESM 

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination:function(req, file, cb) {
        cb(null, path.join(__dirname, "../../public/uploads"));
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.random(Math.round() * 1E9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
})

const upload = multer({storage: storage});

export default upload;