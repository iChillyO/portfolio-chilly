import mongoose, { Schema, model, models } from 'mongoose';

// Sub-schema for Experience Cards
const ExperienceSchema = new Schema({
  title: { type: String, default: "" },
  type: { type: String, default: "" },
  desc: { type: String, default: "" }
});

// Sub-schema for Commotions (Terms of Service)
const CommotionsSectionSchema = new Schema({
  title: { type: String, default: "" },
  content: { type: String, default: "" }
});

// Sub-schema for Pricing Plans
const PricingPlanSchema = new Schema({
  name: { type: String, default: "" },
  price: { type: String, default: "" },
  level: { type: String, default: "" },
  features: [{ type: String }]
});

// Sub-schema for Work Queue Items
const WorkQueueItemSchema = new Schema({
  id: { type: String, default: "" },
  project: { type: String, default: "" },
  status: { type: String, default: "" },
  progress: { type: Number, default: 0 },
  type: { type: String, default: "" }
});

const ProfileSchema = new Schema({
  // 1. Profile Core (Home Page)
  alias: { type: String, default: "Chilly" },
  designation: { type: String, default: "Software Engineer" },
  tagline: { type: String, default: "Building digital artifacts." },
  bioLong: { type: String, default: "" }, // <--- ADDED BACK (Home Page Desc)
  
  // 2. Visual Assets
  avatar: { type: String, default: "" }, // Home Page Image
  aboutImage: { type: String, default: "" }, // About Page Image
  
  // 3. Neural Biography (About Page)
  missionBriefing: { type: String, default: "" }, // About Page Desc
  experienceLog: [ExperienceSchema], 
  
  // 4. Operation Status
  statusMode: { type: String, default: "OPEN" },
  statusMsg: { type: String, default: "SYSTEM ONLINE" },

  // 5. Commotions Page
  commotions: {
    title: { type: String, default: "System Protocols" },
    version: { type: String, default: "3.0.0 (Live)" },
    sections: [CommotionsSectionSchema]
  },

  // 6. Pricing Page
  pricing: [PricingPlanSchema],

  // 7. Work Queue Page
  workQueue: [WorkQueueItemSchema],
  
  // 8. System
  lastSync: { type: Date, default: Date.now }
});

const Profile = models.Profile || model('Profile', ProfileSchema);
export default Profile;