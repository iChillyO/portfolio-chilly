import mongoose, { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  desc: {
    type: String,
    default: '',
  },
  tech: {
    type: [String],
    default: [],
  },
  clientName: { type: String, default: '' },
  timeline: { type: String, default: '' },
  roleStack: { type: String, default: '' },
  coreChallenge: { type: String, default: '' },
  technicalSolution: { type: String, default: '' },
  links: {
    github: { type: String, default: '' },
    demo: { type: String, default: '' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = models.Project || model('Project', ProjectSchema);

export default Project;
