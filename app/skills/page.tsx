"use client";
import { useState } from "react";
import { FaReact, FaNodeJs, FaPython, FaDocker, FaGitAlt, FaFigma, FaDatabase, FaServer, FaMobileAlt, FaPalette, FaCode, FaTools } from "react-icons/fa";
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiMongodb, SiPostgresql, SiGraphql, SiFirebase, SiVercel, SiAdobephotoshop, SiBlender } from "react-icons/si";

interface Skill { name: string; icon: React.ReactNode; level: "Expert" | "Advanced" | "Intermediate" | "Learning"; color: string; }
interface SkillCategory { title: string; icon: React.ReactNode; description: string; skills: Skill[]; }

const skillCategories: SkillCategory[] = [
  { title: "Frontend", icon: <FaCode className="text-cerulean" />, description: "Beautiful, responsive interfaces", skills: [
    { name: "React", icon: <FaReact />, level: "Expert", color: "text-sky-400" },
    { name: "Next.js", icon: <SiNextdotjs />, level: "Expert", color: "text-pearl" },
    { name: "TypeScript", icon: <SiTypescript />, level: "Advanced", color: "text-blue-400" },
    { name: "Tailwind CSS", icon: <SiTailwindcss />, level: "Expert", color: "text-sky-400" },
  ]},
  { title: "Backend", icon: <FaServer className="text-gold" />, description: "Scalable server-side solutions", skills: [
    { name: "Node.js", icon: <FaNodeJs />, level: "Advanced", color: "text-green-400" },
    { name: "Python", icon: <FaPython />, level: "Intermediate", color: "text-yellow-400" },
    { name: "GraphQL", icon: <SiGraphql />, level: "Advanced", color: "text-pink-400" },
    { name: "REST APIs", icon: <FaServer />, level: "Expert", color: "text-orange-400" },
  ]},
  { title: "Database", icon: <FaDatabase className="text-lilac" />, description: "Data modeling and management", skills: [
    { name: "MongoDB", icon: <SiMongodb />, level: "Expert", color: "text-green-500" },
    { name: "PostgreSQL", icon: <SiPostgresql />, level: "Advanced", color: "text-blue-300" },
    { name: "Firebase", icon: <SiFirebase />, level: "Advanced", color: "text-amber-400" },
  ]},
  { title: "DevOps", icon: <FaTools className="text-green-400" />, description: "Shipping code efficiently", skills: [
    { name: "Git", icon: <FaGitAlt />, level: "Expert", color: "text-orange-500" },
    { name: "Docker", icon: <FaDocker />, level: "Intermediate", color: "text-blue-400" },
    { name: "Vercel", icon: <SiVercel />, level: "Expert", color: "text-pearl" },
  ]},
  { title: "Design", icon: <FaPalette className="text-pink-400" />, description: "Concept to pixel-perfect", skills: [
    { name: "Figma", icon: <FaFigma />, level: "Advanced", color: "text-purple-400" },
    { name: "Photoshop", icon: <SiAdobephotoshop />, level: "Advanced", color: "text-blue-500" },
    { name: "Blender", icon: <SiBlender />, level: "Learning", color: "text-orange-400" },
  ]},
  { title: "Mobile", icon: <FaMobileAlt className="text-cerulean" />, description: "Cross-platform apps", skills: [
    { name: "React Native", icon: <FaReact />, level: "Intermediate", color: "text-cyan-400" },
  ]},
];

const levelColors = {
  Expert: "bg-cerulean/15 text-cerulean border-cerulean/20",
  Advanced: "bg-lilac/15 text-lilac border-lilac/20",
  Intermediate: "bg-gold/15 text-gold border-gold/20",
  Learning: "bg-green-500/15 text-green-400 border-green-500/20",
};

export default function Skills() {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? skillCategories : skillCategories.filter(c => c.title.toLowerCase() === active);

  return (
    <main className="min-h-screen bg-deep-bg font-sans select-none overflow-x-hidden relative text-pearl page-top pb-12">
      <div className="absolute top-16 left-[-150px] w-[400px] h-[400px] bg-galaxy/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-5xl mx-auto section-padding relative z-10">
        <div className="text-center mb-10">
          <p className="text-[11px] font-medium text-cerulean uppercase tracking-widest mb-2">What I work with</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-pearl">Skills & <span className="text-gradient-primary">Tech</span></h1>
          <p className="text-pearl/40 text-sm mt-3 max-w-md mx-auto">Tools and technologies I use to bring ideas to life.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button onClick={() => setActive("all")} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${active === "all" ? "bg-cerulean text-white shadow-md shadow-cerulean/20" : "bg-white/[0.04] text-pearl/50 border border-white/[0.06] hover:text-pearl"}`}>All</button>
          {skillCategories.map(c => (
            <button key={c.title} onClick={() => setActive(c.title.toLowerCase())} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${active === c.title.toLowerCase() ? "bg-cerulean text-white shadow-md shadow-cerulean/20" : "bg-white/[0.04] text-pearl/50 border border-white/[0.06] hover:text-pearl"}`}>{c.title}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map(cat => (
            <div key={cat.title} className="glass-card p-5 hover:border-cerulean/20 transition-all">
              <div className="flex items-center gap-2.5 mb-1.5"><div className="text-lg">{cat.icon}</div><h3 className="text-sm font-bold text-pearl">{cat.title}</h3></div>
              <p className="text-[11px] text-pearl/40 mb-4">{cat.description}</p>
              <div className="space-y-2">
                {cat.skills.map(skill => (
                  <div key={skill.name} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-cerulean/10 transition-all">
                    <div className="flex items-center gap-2.5"><span className={`text-base ${skill.color}`}>{skill.icon}</span><span className="text-xs text-pearl/80">{skill.name}</span></div>
                    <span className={`text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border ${levelColors[skill.level]}`}>{skill.level}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
