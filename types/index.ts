// ~/types/index.ts

export interface Project {
  _id: string;
  title: string;
  category: string;
  image: string;
  desc: string;
  tech: string[];
  links: {
    github: string;
    demo: string;
  };
  createdAt: Date;
}

export interface ExperienceCard {
  title: string;
  type: string;
  desc: string;
}

export interface ProtocolSection {
  title: string;
  content: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  level: string;
  features: string[];
}

export interface WorkQueueItem {
  id: string;
  project: string;
  status: string;
  progress: number;
  type: string;
}

export interface ProfileData {
  alias: string;
  designation: string;
  tagline: string;
  bioLong: string;
  avatar: string;
  aboutImage: string;
  missionBriefing: string;
  experienceLog: ExperienceCard[];
  statusMode: string;
  statusMsg: string;
  protocols: {
    title: string;
    version: string;
    sections: ProtocolSection[];
  };
  pricing: PricingPlan[];
  workQueue: WorkQueueItem[];
  lastSync: string;
}
