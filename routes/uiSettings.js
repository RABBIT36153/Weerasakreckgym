import express from 'express';
import {
  getUISettings,
  updateUISettings,
  updateHeaderSettings,
  updateBrandingSettings,
  updateHomepageSettings,
  updateFooterSettings,
  updateContactSettings,
  updateServicesSettings,
  updateContentSettings,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  addSlider,
  updateSlider,
  deleteSlider,
  reorderSlider
} from '../controllers/uiSettingsController.js';

const router = express.Router();

// Main routes
router.get('/', getUISettings);
router.put('/', updateUISettings);

// Specific section routes
router.put('/header', updateHeaderSettings);
router.put('/branding', updateBrandingSettings);
router.put('/homepage', updateHomepageSettings);
router.put('/footer', updateFooterSettings);
router.put('/contact', updateContactSettings);
router.put('/services', updateServicesSettings);
router.put('/content', updateContentSettings);

// Gallery routes
router.post('/gallery', addGalleryImage);
router.put('/gallery/:index', updateGalleryImage);
router.delete('/gallery/:index', deleteGalleryImage);

// Slider routes
router.post('/slider', addSlider);
router.put('/slider/:index', updateSlider);
router.delete('/slider/:index', deleteSlider);
router.put('/slider/reorder', reorderSlider);

export default router;

