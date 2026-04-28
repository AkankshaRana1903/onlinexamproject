import Certificate from '../models/Certificate.js';

// Get user's certificates
export const getUserCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user.id })
      .sort({ issueDate: -1 });
    
    res.status(200).json({
      success: true,
      count: certificates.length,
      certificates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single certificate
export const getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }
    
    // Check if certificate belongs to user or user is admin
    if (
      certificate.userId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this certificate'
      });
    }
    
    res.status(200).json({
      success: true,
      certificate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Verify certificate (public route)
export const verifyCertificate = async (req, res) => {
  try {
    const { certificateNumber } = req.params;
    
    const certificate = await Certificate.findOne({ certificateNumber })
      .populate('userId', 'name')
      .populate('examId', 'title');
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or invalid'
      });
    }
    
    // Check if certificate is expired
    if (certificate.expiryDate && new Date() > certificate.expiryDate) {
      return res.status(200).json({
        success: true,
        isValid: false,
        message: 'Certificate has expired',
        certificate: {
          certificateNumber: certificate.certificateNumber,
          userName: certificate.userName,
          examTitle: certificate.examTitle,
          issueDate: certificate.issueDate,
          expiryDate: certificate.expiryDate
        }
      });
    }
    
    res.status(200).json({
      success: true,
      isValid: true,
      certificate: {
        certificateNumber: certificate.certificateNumber,
        userName: certificate.userName,
        examTitle: certificate.examTitle,
        issueDate: certificate.issueDate,
        expiryDate: certificate.expiryDate,
        score: certificate.score
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};