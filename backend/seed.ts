import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define inline schemas just for seeding purposes to avoid import path issues
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'sales'], default: 'sales' }
});

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Lost'], default: 'New' },
  source: { type: String, enum: ['Website', 'Instagram', 'Referral', 'LinkedIn', 'Cold Call'], default: 'Website' },
  createdAt: { type: Date, default: Date.now }
});

const ActivitySchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  action: { type: String, required: true },
  userName: { type: String, required: true },
  oldValue: { type: String },
  newValue: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model<any>('User', UserSchema);
const Lead = mongoose.model<any>('Lead', LeadSchema);
const Activity = mongoose.model<any>('Activity', ActivitySchema);

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_leads';
    await mongoose.connect(mongoUri);
    console.log('🌱 Connected to MongoDB successfully...');

    // 2. Clear existing collections to start fresh
    await User.deleteMany({});
    await Lead.deleteMany({});
    await Activity.deleteMany({});
    console.log('🧹 Cleared old data...');

    // 3. Create Mock Users (Passwords hashed with bcrypt)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const adminUser = await User.create({
      name: 'Mohammad Shaikh',
      email: 'admin@crm.com',
      password: hashedPassword,
      role: 'admin'
    });

    const salesUser = await User.create({
      name: 'Rahul Yadav',
      email: 'rahul@crm.com',
      password: hashedPassword,
      role: 'sales'
    });

    console.log('👥 Mock users created successfully!');
    console.log('   👉 Admin: admin@crm.com | password123');
    console.log('   👉 Sales: rahul@crm.com | password123');

    // 4. Create Mock Leads with specific combinations to test advanced filtering
    const mockLeadsData = [
      { name: 'Amit Sharma', email: 'amit@example.com', status: 'New', source: 'Website', daysAgo: 5 },
      { name: 'Priya Patel', email: 'priya@example.com', status: 'Contacted', source: 'Instagram', daysAgo: 4 },
      { name: 'Rahul Mishra', email: 'rahul.m@example.com', status: 'Qualified', source: 'Instagram', daysAgo: 3 },
      { name: 'Sneha Reddy', email: 'sneha@example.com', status: 'Lost', source: 'Referral', daysAgo: 2 },
      { name: 'Vikram Malhotra', email: 'vikram@example.com', status: 'Qualified', source: 'LinkedIn', daysAgo: 1 },
      { name: 'Ananya Iyer', email: 'ananya@example.com', status: 'New', source: 'Cold Call', daysAgo: 0 },
      // Extra leads to test backend pagination (Need > 10 items to trigger page 2)
      { name: 'Rohan Das', email: 'rohan@example.com', status: 'New', source: 'Website', daysAgo: 6 },
      { name: 'Kiran Verma', email: 'kiran@example.com', status: 'Contacted', source: 'Website', daysAgo: 7 },
      { name: 'Deepak Gupta', email: 'deepak@example.com', status: 'Qualified', source: 'Referral', daysAgo: 8 },
      { name: 'Nisha Rao', email: 'nisha@example.com', status: 'Lost', source: 'LinkedIn', daysAgo: 9 },
      { name: 'Sanjay Dutt', email: 'sanjay@example.com', status: 'Contacted', source: 'Instagram', daysAgo: 10 },
      { name: 'Pooja Hegde', email: 'pooja@example.com', status: 'New', source: 'LinkedIn', daysAgo: 11 },
    ];

    console.log('📈 Inserting mock leads...');
    
    for (const leadData of mockLeadsData) {
      const creationDate = new Date();
      creationDate.setDate(creationDate.getDate() - leadData.daysAgo);

      const lead = await Lead.create({
        name: leadData.name,
        email: leadData.email,
        status: leadData.status,
        source: leadData.source,
        createdAt: creationDate
      });

      // 5. Generate matching chronological Activity Timelines for the leads
      // Action 1: Every lead gets a "created" event
      const initialDate = new Date(creationDate);
      initialDate.setMinutes(initialDate.getMinutes() - 30); // 30 minutes before setup
      
      await Activity.create({
        leadId: lead._id,
        action: 'created',
        userName: adminUser.name,
        createdAt: initialDate
      });

      // Action 2: If status isn't "New", simulate that a sales user updated it later
      if (lead.status !== 'New') {
        const updateDate = new Date(creationDate);
        updateDate.setMinutes(updateDate.getMinutes() + 15); // 15 minutes later

        await Activity.create({
          leadId: lead._id,
          action: 'status_changed',
          userName: salesUser.name,
          oldValue: 'New',
          newValue: lead.status,
          createdAt: updateDate
        });
      }
    }

    console.log('⏱️ Chronological activity timelines populated successfully!');
    console.log('✅ Database seeding complete. Ready for full-stack validation testing.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();