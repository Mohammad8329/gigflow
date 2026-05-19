import { Response } from 'express';
import Lead from '../models/Lead.model';
import { logActivity } from '../services/activity.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { generateCSV } from '../utils/csvExport';

/**
 * @desc    Export filtered leads as CSV
 * @route   GET /api/leads/export/csv
 */
export const exportLeadsCSV = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, source, search, sort } = req.query;
    
    const query: any = {};
    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;

    // Notice we removed .skip() and .limit() here!
    const leads = await Lead.find(query).sort({ createdAt: sortOrder });

    const csvString = generateCSV(leads);

    // Set headers to force the browser/client to download it as a file
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads_export.csv"');
    
    res.status(200).send(csvString);
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

/**
 * @desc    Create a new lead
 * @route   POST /api/leads
 */
export const createLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;
    const userId = req.user!._id;

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: userId,
      updatedBy: userId,
    });

    // Standout Feature: Log the creation
    logActivity({
      leadId: lead._id,
      userId: userId,
      userName: req.user!.name,
      action: 'created',
    });

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

/**
 * @desc    Get all leads (with advanced filtering & pagination)
 * @route   GET /api/leads
 */
export const getLeads = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, source, search, sort, page = '1', limit = '10' } = req.query;
    
    // 1. Build the dynamic query object
    const query: any = {};
    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // 2. Pagination Math
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // 3. Sorting
    const sortOrder = sort === 'oldest' ? 1 : -1;

    // 4. Execute Queries
    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limitNumber)
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

/**
 * @desc    Get single lead by ID
 * @route   GET /api/leads/:id
 */
export const getLeadById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

/**
 * @desc    Update a lead
 * @route   PUT /api/leads/:id
 */
export const updateLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const leadId = req.params.id;
    const userId = req.user!._id;
    const userName = req.user!.name;
    const { name, email, status, source } = req.body;

    const oldLead = await Lead.findById(leadId);
    if (!oldLead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }

    // Detect if status changed for our timeline feature
    if (status && status !== oldLead.status) {
      logActivity({
        leadId,
        userId,
        userName,
        action: 'status_changed',
        field: 'status',
        oldValue: oldLead.status,
        newValue: status,
      });
    } else {
      // Generic update log
      logActivity({ leadId, userId, userName, action: 'updated' });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      { name, email, status, source, updatedBy: userId },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedLead });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

/**
 * @desc    Delete a lead
 * @route   DELETE /api/leads/:id
 */
export const deleteLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const leadId = req.params.id;
    const lead = await Lead.findById(leadId);
    
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }

    await Lead.findByIdAndDelete(leadId);

    // Log the deletion
    logActivity({
      leadId,
      userId: req.user!._id,
      userName: req.user!.name,
      action: 'deleted',
    });

    res.status(200).json({ success: true, message: 'Lead removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};