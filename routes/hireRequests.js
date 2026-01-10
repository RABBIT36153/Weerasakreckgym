import express from 'express';
import {
  getAllHireRequests,
  getHireRequestById,
  createHireRequest,
  updateHireRequest,
  updateHireRequestStatus,
  deleteHireRequest
} from '../controllers/hireRequestsController.js';

const router = express.Router();

router.get('/', getAllHireRequests);
router.get('/:id', getHireRequestById);
router.post('/', createHireRequest);
router.put('/:id', updateHireRequest);
router.put('/:id/status', updateHireRequestStatus);
router.delete('/:id', deleteHireRequest);

export default router;

