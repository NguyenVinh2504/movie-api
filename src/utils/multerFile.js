import multer from 'multer'
export const uploadMulter = multer({ storage: multer.memoryStorage() })
