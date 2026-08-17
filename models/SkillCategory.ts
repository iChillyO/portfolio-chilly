import mongoose, { Schema, model, models } from 'mongoose';

// Sub-schema for individual skills within a category
const SkillItemSchema = new Schema({
  name: { type: String, required: true },
  icon: { type: String, default: "FaCode" }, // Icon name string (e.g. "FaReact", "SiTypescript")
  level: { type: String, enum: ["Expert", "Advanced", "Intermediate", "Learning"], default: "Intermediate" },
  color: { type: String, default: "text-cerulean" }, // Tailwind color class
  order: { type: Number, default: 0 },
});

// Main schema for skill categories
const SkillCategorySchema = new Schema({
  title: { type: String, required: true }, // e.g. "Frontend", "Backend"
  icon: { type: String, default: "FaCode" }, // Icon name string
  iconColor: { type: String, default: "text-cerulean" }, // Tailwind color class for the category icon
  description: { type: String, default: "" },
  skills: [SkillItemSchema],
  order: { type: Number, default: 0 }, // For ordering categories
  visible: { type: Boolean, default: true }, // Toggle visibility without deleting
}, { timestamps: true });

const SkillCategory = models.SkillCategory || model('SkillCategory', SkillCategorySchema);
export default SkillCategory;
