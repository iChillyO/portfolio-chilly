"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaGithub, FaExternalLinkAlt, FaFolderOpen, FaCode, FaPaintBrush, FaMobileAlt, FaTimes, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Project } from "@/types";

const categories = [
  { name: "All", icon: <FaFolderOpen /> },
  { name: "Web Dev", icon: <FaCode /> },
  { name: "Mobile", icon: <FaMobileAlt /> },
  { name: "Design", icon: <FaPaintBrush /> },
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/projects', { signal: controller.signal })
      .then(res => res.json())
      .then(data => { if (data.success) setProjects(data.data); })
      .catch(err => { if (err.name !== 'AbortError') console.error("Failed to load projects:", err); })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, []);

  const filteredProjects = activeCategory === "All" ? projects : projects.filter(p => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-deep-bg font-sans select-none overflow-x-hidden relative text-pearl page-top pb-12">
      <div className="deco-blur absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-galaxy/30 rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto section-padding relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-pearl">My <span className="text-gradient-primary">Projects</span></h1>
          <p className="text-pearl/40 text-xs mt-1.5 max-w-sm mx-auto">A showcase of things I&apos;ve built and shipped.</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button key={cat.name} onClick={() => setActiveCategory(cat.name)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-colors ${activeCategory === cat.name ? "bg-cerulean text-deep-bg shadow-md shadow-cerulean/20" : "bg-white/[0.04] text-pearl/50 border border-white/[0.06]"}`}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48"><div className="w-10 h-10 border-2 border-cerulean/30 border-t-cerulean rounded-full animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.length > 0 ? filteredProjects.map((project) => (
              <div key={project._id} onClick={() => setSelectedProject(project)} className="group cursor-pointer glass-card-hover overflow-hidden">
                <div className="relative h-44 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10 opacity-70" />
                  <Image src={project.images?.[0] || "/images/final.png"} alt={project.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 z-20"><span className="text-[10px] font-medium text-cerulean bg-cerulean/10 px-2.5 py-1 rounded-full border border-cerulean/20">{project.category}</span></div>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold text-pearl mb-1.5 group-hover:text-cerulean transition-colors">{project.title}</h3>
                  <p className="text-xs text-pearl/40 mb-4 line-clamp-2">{project.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(project.tech || []).slice(0, 3).map((t, i) => <span key={i} className="text-[10px] text-pearl/50 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.05]">{t}</span>)}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                    <span className="text-[11px] text-pearl/40">View details</span>
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-cerulean/10 text-cerulean"><FaChevronRight size={8} /></div>
                  </div>
                </div>
              </div>
            )) : <div className="col-span-full text-center py-16"><p className="text-pearl/30">No projects in this category.</p></div>}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/80" onClick={() => { setSelectedProject(null); setCurrentImgIndex(0); }}>
          <div className="bg-surface border border-white/[0.06] w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 z-30 bg-surface/95 border-b border-white/[0.05] p-4 flex justify-between items-center">
              <div><span className="text-cerulean text-[10px] font-medium tracking-widest uppercase block">{selectedProject.category}</span><h2 className="text-lg font-bold text-pearl">{selectedProject.title}</h2></div>
              <button onClick={() => { setSelectedProject(null); setCurrentImgIndex(0); }} className="p-2 bg-white/5 hover:bg-red-500/10 text-pearl/50 hover:text-red-400 rounded-lg transition-colors"><FaTimes size={16} /></button>
            </div>
            <div className="p-5 md:p-8 space-y-6">
              <div className="relative aspect-video bg-deep-bg rounded-xl overflow-hidden border border-white/[0.05]">
                {selectedProject.images?.length ? (<>
                  <Image src={selectedProject.images[currentImgIndex]} alt={selectedProject.title} fill sizes="(max-width: 768px) 100vw, 800px" className="object-contain" />
                  {selectedProject.images.length > 1 && (<>
                    <button onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(p => p === 0 ? selectedProject.images!.length - 1 : p - 1); }} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-lg"><FaChevronLeft size={10} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(p => p === selectedProject.images!.length - 1 ? 0 : p + 1); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-lg"><FaChevronRight size={10} /></button>
                  </>)}
                </>) : <Image src="/images/final.png" alt="Fallback" fill sizes="800px" className="object-contain" />}
              </div>
              <p className="text-sm text-pearl/50 leading-relaxed">{selectedProject.desc}</p>
              <div className="flex flex-wrap gap-1.5">{(selectedProject.tech || []).map((t, i) => <span key={i} className="text-[10px] text-cerulean bg-cerulean/10 px-2.5 py-1 rounded-md border border-cerulean/15">{t}</span>)}</div>
              <div className="flex gap-3">
                <a href={selectedProject.links?.github} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-white/[0.04] border border-white/[0.06] text-pearl text-xs font-medium py-2.5 rounded-lg transition-colors hover:bg-white/[0.08]"><FaGithub size={13} /> Repo</a>
                <a href={selectedProject.links?.demo} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-cerulean text-deep-bg text-xs font-medium py-2.5 rounded-lg shadow-md shadow-cerulean/20"><FaExternalLinkAlt size={11} /> Demo</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
