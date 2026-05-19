import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/lead.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = express.Router();

// Apply the 'protect' middleware to ALL routes below this line
// You MUST have a valid JWT to access anything here
router.use(protect);

router.route('/')
  .get(getLeads)
  .post(createLead);

router.get('/export/csv', authorize('admin'), exportLeadsCSV);

router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(authorize('admin'), deleteLead); // VIP Manager: Only admins can hit this

export default router;