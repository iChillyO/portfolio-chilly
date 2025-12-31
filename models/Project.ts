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
  image: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  tech: {
    type: [String],
    default: [],
  },
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
