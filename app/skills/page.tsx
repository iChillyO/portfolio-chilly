"use client";
import { useState } from "react";
import { FaReact, FaNodeJs, FaPython, FaDocker, FaGitAlt, FaFigma, FaDatabase, FaServer, FaMobileAlt, FaPalette, FaCode, FaTools } from "react-icons/fa";
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiMongodb, SiPostgresql, SiGraphql, SiFirebase, SiVercel, SiAdobephotoshop, SiBlender } from "react-icons/si";

// --- SKILL CATEGORIES ---
interface Skill {
  name: string;
  icon: React.ReactNode;
  level: "Expert" | "Advanced" | "Intermediate" | "Learning";
  color: string;
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  description: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    icon: <FaCode className="text-violet-400" />,
    description: "Building beautiful, responsive interfaces",
    skills: [
      { name: "React", icon: <FaReact />, level: "Expert", color: "text-cyan-400" },
      { name: "Next.js", icon: <SiNextdotjs />, level: "Expert", color: "text-white" },
      { name: "TypeScript", icon: <SiTypescript />, level: "Advanced", color: "text-blue-400" },
      { name: "Tailwind CSS", icon: <SiTailwindcss />, level: "Expert", color: "text-sky-400" },
    ],
  },
  {
    title: "Backend",
    icon: <FaServer className="text-amber-400" />,
    description: "Scalable server-side architecture",
    skills: [
      { name: "Node.js", icon: <FaNodeJs />, level: "Advanced", color: "text-green-400" },
      { name: "Python", icon: <FaPython />, level: "Intermediate", color: "text-yellow-400" },
      { name: "GraphQL", icon: <SiGraphql />, level: "Advanced", color: "text-pink-400" },
      { name: "REST APIs", icon: <FaServer />, level: "Expert", color: "text-orange-400" },
    ],
  },
  {
    title: "Database",
    icon: <FaDatabase className="text-sky-400" />,
    description: "Data modeling and management",
    skills: [
      { name: "MongoDB", icon: <SiMongodb />, level: "Expert", color: "text-green-500" },
      { name: "PostgreSQL", icon: <SiPostgresql />, level: "Advanced", color: "text-blue-300" },
      { name: "Firebase", icon: <SiFirebase />, level: "Advanced", color: "text-amber-400" },
    ],
  },
  {
    title: "DevOps & Tools",
    icon: <FaTools className="text-green-400" />,
    description: "Shipping code efficiently",
    skills: [
      { name: "Git", icon: <FaGitAlt />, level: "Expert", color: "text-orange-500" },
      { name: "Docker", icon: <FaDocker />, level: "Intermediate", color: "text-blue-400" },
      { name: "Vercel", icon: <SiVercel />, level: "Expert", color: "text-white" },
    ],
  },
  {
    title: "Design",
    icon: <FaPalette className="text-pink-400" />,
    description: "From concept to pixel-perfect design",
    skills: [
      { name: "Figma", icon: <FaFigma />, level: "Advanced", color: "text-purple-400" },
      { name: "Photoshop", icon: <SiAdobephotoshop />, level: "Advanced", color: "text-blue-500" },
      { name: "Blender", icon: <SiBlender />, level: "Learning", color: "text-orange-400" },
    ],
  },
  {
    title: "Mobile",
    icon: <FaMobileAlt className="text-violet-400" />,
    description: "Cross-platform mobile development",
    skills: [
      { name: "React Native", icon: <FaReact />, level: "Intermediate", color: "text-cyan-400" },
    ],
  },
];

const levelColors = {
  Expert: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  Advanced: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Intermediate: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Learning: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredCategories = activeCategory === "all"
    ? skillCategories
    : skillCategories.filter(cat => cat.title.toLowerCase() === activeCategory);

  return (
    <main className="min-h-screen w-full bg-deep-bg font-sans select-none overflow-x-hidden relative pt-28 md:pt-36 pb-16 text-white">

      {/* Background decorations */}
      <div className="absolute top-20 left-[-200px] w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-[-200px] w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto section-padding relative z-10">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">What I work with</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4">
            Skills & <span className="text-gradient-primary">Technologies</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            A collection of tools and technologies I use to bring ideas to life.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
              activeCategory === "all"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                : "bg-white/5 text-slate-400 border border-white/[0.06] hover:text-white hover:bg-white/10"
            }`}
          >
            All
          </button>
          {skillCategories.map((cat) => (
            <button
              key={cat.title}
              onClick={() => setActiveCategory(cat.title.toLowerCase())}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                activeCategory === cat.title.toLowerCase()
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "bg-white/5 text-slate-400 border border-white/[0.06] hover:text-white hover:bg-white/10"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.title} className="glass-card p-6 md:p-8 group hover:border-violet-500/20 transition-all duration-500">

              {/* Category Header */}
              <div className="flex items-center gap-3 mb-2">
                <div className="text-xl">{category.icon}</div>
                <h3 className="text-lg font-bold text-white">{category.title}</h3>
              </div>
              <p className="text-sm text-slate-500 mb-6">{category.description}</p>

              {/* Skills List */}
              <div className="space-y-3">
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-violet-500/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-lg ${skill.color}`}>{skill.icon}</span>
                      <span className="text-sm font-medium text-slate-200">{skill.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${levelColors[skill.level]}`}>
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="glass-card inline-block px-8 py-6 text-center">
            <p className="text-slate-400 text-sm mb-2">Always learning, always growing.</p>
            <p className="text-xs text-slate-600">This list evolves as I explore new technologies.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
