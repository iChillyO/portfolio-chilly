"use client";
import { useState, useEffect } from "react";
import { SkillCategoryData } from "@/types";
import {
  FaReact, FaNodeJs, FaPython, FaDocker, FaGitAlt, FaFigma, FaDatabase,
  FaServer, FaMobileAlt, FaPalette, FaCode, FaTools, FaGlobe, FaLock,
  FaCogs, FaRocket, FaTerminal, FaCloud, FaGamepad, FaMusic, FaPen,
  FaChartBar, FaShieldAlt, FaBolt, FaCube, FaLayerGroup
} from "react-icons/fa";
import {
  SiTypescript, SiNextdotjs, SiTailwindcss, SiMongodb, SiPostgresql,
  SiGraphql, SiFirebase, SiVercel, SiAdobephotoshop, SiBlender,
  SiDocker, SiGit, SiPython, SiNodedotjs, SiReact
} from "react-icons/si";

const iconMap: Record<string, React.ReactNode> = {
  FaReact: <FaReact />, FaNodeJs: <FaNodeJs />, FaPython: <FaPython />,
  FaDocker: <FaDocker />, FaGitAlt: <FaGitAlt />, FaFigma: <FaFigma />,
  FaDatabase: <FaDatabase />, FaServer: <FaServer />, FaMobileAlt: <FaMobileAlt />,
  FaPalette: <FaPalette />, FaCode: <FaCode />, FaTools: <FaTools />,
  FaGlobe: <FaGlobe />, FaLock: <FaLock />, FaCogs: <FaCogs />,
  FaRocket: <FaRocket />, FaTerminal: <FaTerminal />, FaCloud: <FaCloud />,
  FaGamepad: <FaGamepad />, FaMusic: <FaMusic />, FaPen: <FaPen />,
  FaChartBar: <FaChartBar />, FaShieldAlt: <FaShieldAlt />, FaBolt: <FaBolt />,
  FaCube: <FaCube />, FaLayerGroup: <FaLayerGroup />,
  SiTypescript: <SiTypescript />, SiNextdotjs: <SiNextdotjs />,
  SiTailwindcss: <SiTailwindcss />, SiMongodb: <SiMongodb />,
  SiPostgresql: <SiPostgresql />, SiGraphql: <SiGraphql />,
  SiFirebase: <SiFirebase />, SiVercel: <SiVercel />,
  SiAdobephotoshop: <SiAdobephotoshop />, SiBlender: <SiBlender />,
  SiDocker: <SiDocker />, SiGit: <SiGit />, SiPython: <SiPython />,
  SiNodedotjs: <SiNodedotjs />, SiReact: <SiReact />,
};

const getIcon = (name: string): React.ReactNode => iconMap[name] || <FaCode />;

const levelColors: Record<string, string> = {
  Expert: "bg-cerulean/15 text-cerulean border-cerulean/20",
  Advanced: "bg-lilac/15 text-lilac border-lilac/20",
  Intermediate: "bg-gold/15 text-gold border-gold/20",
  Learning: "bg-green-500/15 text-green-400 border-green-500/20",
};

export default function Skills() {
  const [categories, setCategories] = useState<SkillCategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("all");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/skills", { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.data.filter((c: SkillCategoryData) => c.visible !== false));
      })
      .catch(err => { if (err.name !== 'AbortError') console.error("Failed to load skills:", err); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const filtered = active === "all"
    ? categories
    : categories.filter(c => c.title.toLowerCase() === active);

  if (loading) {
    return (
      <main className="min-h-screen bg-deep-bg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-cerulean/30 border-t-cerulean rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-deep-bg font-sans select-none overflow-x-hidden relative text-pearl page-top pb-12">
      <div className="deco-blur absolute top-16 left-[-150px] w-[400px] h-[400px] bg-galaxy/30 rounded-full blur-[100px]" />
      <div className="max-w-5xl mx-auto section-padding relative z-10">

        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-pearl">
            Skills & <span className="text-gradient-primary">Tech</span>
          </h1>
          <p className="text-pearl/40 text-xs mt-1.5 max-w-sm mx-auto">
            Tools and technologies I use to bring ideas to life.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActive("all")}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
              active === "all"
                ? "bg-cerulean text-deep-bg shadow-md shadow-cerulean/20"
                : "bg-white/[0.04] text-pearl/50 border border-white/[0.06]"
            }`}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c._id || c.title}
              onClick={() => setActive(c.title.toLowerCase())}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                active === c.title.toLowerCase()
                  ? "bg-cerulean text-deep-bg shadow-md shadow-cerulean/20"
                  : "bg-white/[0.04] text-pearl/50 border border-white/[0.06]"
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.length > 0 ? (
            filtered.map(cat => (
              <div key={cat._id || cat.title} className="glass-card p-5">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className={`text-lg ${cat.iconColor || "text-cerulean"}`}>
                    {getIcon(cat.icon)}
                  </div>
                  <h3 className="text-sm font-bold text-pearl">{cat.title}</h3>
                </div>
                <p className="text-[11px] text-pearl/40 mb-4">{cat.description}</p>

                <div className="space-y-2">
                  {(cat.skills || [])
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map(skill => (
                      <div
                        key={skill._id || skill.name}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`text-base ${skill.color || "text-cerulean"}`}>
                            {getIcon(skill.icon)}
                          </span>
                          <span className="text-xs text-pearl/80">{skill.name}</span>
                        </div>
                        <span className={`text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border ${levelColors[skill.level] || levelColors.Intermediate}`}>
                          {skill.level}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-pearl/30">
              No skills found.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
