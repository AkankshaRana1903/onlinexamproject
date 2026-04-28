import express from 'express';
import { 
  getUserCertificates, 
  getCertificate,
  verifyCertificate
} from '../controllers/certificateController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get user's certificates
router.get('/my', protect, getUserCertificates);

// Get single certificate
router.get('/:id', protect, getCertificate);

// Verify certificate (public route)
router.get('/verify/:certificateNumber', verifyCertificate);

export default router;