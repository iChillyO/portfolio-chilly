"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaGithub, FaExternalLinkAlt, FaFolderOpen, FaCode, FaPaintBrush, FaMobileAlt, FaSpinner } from "react-icons/fa";
import { Project } from "@/types";

const categories = [
  { name: "All", icon: <FaFolderOpen /> },
  { name: "Web Dev", icon: <FaCode /> },
  { name: "Mobile", icon: <FaMobileAlt /> },
  { name: "Design", icon: <FaPaintBrush /> },
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]); // Store DB data
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // FETCH DATA ON LOAD
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.success) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <main className="h-screen w-full bg-deep-bg bg-space-pattern bg-cover bg-center bg-fixed font-sans select-none flex flex-col items-center overflow-hidden relative">
      
      {/* Background Blurs */}
      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-deep-bg via-deep-bg/90 to-transparent pointer-events-none z-10"></div>
      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-deep-bg via-deep-bg/90 to-transparent pointer-events-none z-10"></div>

      {/* Header */}
      <div className="max-w-7xl w-full relative z-20 shrink-0 px-4 md:px-12 mt-24 mb-4">
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          Mission <span className="text-cyan-500">Log</span>
        </h1>
        
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-full border transition-all duration-300 font-bold uppercase tracking-widest text-xs
                ${activeCategory === cat.name 
                  ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]" 
                  : "bg-black/40 text-gray-400 border-white/10 hover:border-cyan-500/50 hover:text-white"}
              `}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-4 md:px-12 pb-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 w-full text-cyan-500 gap-4">
             <FaSpinner className="animate-spin text-4xl" />
             <span className="font-mono tracking-widest text-sm animate-pulse">ESTABLISHING DATABASE UPLINK...</span>
          </div>
        ) : (
          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 pb-24">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard key={project._id} data={project} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 font-mono py-20">
                NO MISSIONS FOUND IN SECTOR.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

const ProjectCard = ({ data }: { data: Project }) => (
  <div className="group relative bg-[#0a1128]/60 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]">
    <div className="relative h-56 w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128] to-transparent z-10 opacity-60"></div>
      <Image 
        src={data.image || "/images/placeholder.jpg"} 
        alt={data.title} 
        fill 
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">{data.category}</span>
      </div>
    </div>

    <div className="p-6 relative z-20">
      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">{data.title}</h3>
      <p className="text-blue-200/70 text-sm mb-6 line-clamp-2 leading-relaxed">{data.desc}</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {(data.tech || []).map((t, i) => (
          <span key={i} className="text-[10px] font-bold text-cyan-300 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-500/20">{t}</span>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-white/5">
       <a href={data.links?.demo || "#"} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"><FaGithub /> Code</a>
        <a href={data.links?.demo} className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors ml-auto font-bold">Live Demo <FaExternalLinkAlt className="text-xs" /></a>
      </div>
    </div>
  </div>
);