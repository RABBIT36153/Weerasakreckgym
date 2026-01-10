import express from 'express';
import {
  getAllRegistrations,
  getRegistrationById,
  createRegistration,
  updateRegistration,
  updateRegistrationStatus,
  deleteRegistration
} from '../controllers/registrationsController.js';

const router = express.Router();

router.get('/', getAllRegistrations);
router.get('/:id', getRegistrationById);
router.post('/', createRegistration);
router.put('/:id', updateRegistration);
router.put('/:id/status', updateRegistrationStatus);
router.delete('/:id', deleteRegistration);

export default router;

