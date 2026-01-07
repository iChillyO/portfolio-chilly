"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaGithub, FaExternalLinkAlt, FaFolderOpen, FaCode, FaPaintBrush, FaMobileAlt, FaSpinner, FaTimes, FaCalendarAlt, FaUser, FaRocket, FaLightbulb, FaChevronRight } from "react-icons/fa";
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

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
    <main className="min-h-screen w-full bg-deep-bg font-sans select-none flex flex-col items-center overflow-x-hidden relative text-white pb-12">


      {/* Header */}
      <div className="max-w-7xl w-full relative z-20 px-4 md:px-12 mt-24 mb-4">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] text-center md:text-left">
          Mission <span className="text-cyan-500">Log</span>
        </h1>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 md:gap-4 justify-center md:justify-start">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`
                flex items-center gap-2 px-4 md:px-6 py-2 rounded-full border transition-all duration-300 font-bold uppercase tracking-widest text-[10px] md:text-xs
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
      <div className="w-full px-4 md:px-12 pb-12 z-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 w-full text-cyan-500 gap-4">
            <FaSpinner className="animate-spin text-4xl" />
            <span className="font-mono tracking-widest text-sm animate-pulse">ESTABLISHING DATABASE UPLINK...</span>
          </div>
        ) : (
          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pt-4 pb-24">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard key={project._id} data={project} onClick={() => setSelectedProject(project)} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 font-mono py-20">
                NO MISSIONS FOUND IN SECTOR.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => { setSelectedProject(null); setCurrentImgIndex(0); }}
        >
          <div
            className="bg-[#050b14] border border-cyan-500/30 w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.2)] custom-scrollbar"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-30 bg-[#050b14]/80 backdrop-blur-md border-b border-white/10 p-4 md:p-6 flex justify-between items-center">
              <div>
                <span className="text-cyan-500 font-mono text-[10px] md:text-xs tracking-widest uppercase mb-1 block">{selectedProject.category}</span>
                <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter line-clamp-1">{selectedProject.title}</h2>
              </div>
              <button
                onClick={() => { setSelectedProject(null); setCurrentImgIndex(0); }}
                className="p-2 md:p-3 bg-white/5 hover:bg-red-500/20 text-white hover:text-red-500 rounded-full transition-all border border-white/10 hover:border-red-500/50"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-4 md:p-10">
              {/* Media & Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-12">
                {/* Left: Image Switcher */}
                <div className="space-y-4">
                  <div className="relative group aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    {selectedProject.images && selectedProject.images.length > 0 ? (
                      <>
                        <Image
                          src={selectedProject.images[currentImgIndex] || "/images/final.png"}
                          alt={`${selectedProject.title} - ${currentImgIndex + 1}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />

                        {/* Navigation Buttons */}
                        {selectedProject.images.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImgIndex((prev) => (prev === 0 ? selectedProject.images!.length - 1 : prev - 1));
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-cyan-500/80 text-white rounded-full transition-all border border-white/10 hover:border-cyan-400 group/btn"
                            >
                              <FaChevronRight className="rotate-180" size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImgIndex((prev) => (prev === selectedProject.images!.length - 1 ? 0 : prev + 1));
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-cyan-500/80 text-white rounded-full transition-all border border-white/10 hover:border-cyan-400 group/btn"
                            >
                              <FaChevronRight size={14} />
                            </button>

                            {/* Counter Overlay */}
                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[9px] uppercase tracking-widest font-bold text-cyan-400">
                              {currentImgIndex + 1} / {selectedProject.images.length}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <Image src="/images/final.png" alt="Fallback" fill className="object-contain" />
                    )}
                  </div>

                  {/* Thumbnails (Optional, let's add dots instead) */}
                  {selectedProject.images && selectedProject.images.length > 1 && (
                    <div className="flex justify-center gap-1.5">
                      {selectedProject.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImgIndex(i)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${currentImgIndex === i ? "bg-cyan-500 w-4" : "bg-cyan-500/20"}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Quick Info */}
                <div className="flex flex-col justify-between">
                  <div className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-cyan-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-1">
                          <FaUser size={8} /> Client
                        </div>
                        <div className="text-white font-bold text-[11px] md:text-sm truncate">{selectedProject.clientName || "N/A"}</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-cyan-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-1">
                          <FaCalendarAlt size={8} /> Timeline
                        </div>
                        <div className="text-white font-bold text-[11px] md:text-sm truncate">{selectedProject.timeline || "N/A"}</div>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-xl">
                      <div className="flex items-center gap-2 text-cyan-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-3">
                        <FaRocket size={10} /> Role & Stack
                      </div>
                      <div className="text-gray-300 text-[10px] md:text-xs leading-relaxed mb-4 line-clamp-3">{selectedProject.roleStack || "N/A"}</div>
                      <div className="flex flex-wrap gap-2">
                        {(selectedProject.tech || []).map((t, i) => (
                          <span key={i} className="text-[8px] md:text-[9px] font-bold text-cyan-300 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20">{t}</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <a
                        href={selectedProject.links?.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl transition-all text-[10px] uppercase tracking-widest"
                      >
                        <FaGithub size={14} /> Repository
                      </a>
                      <a
                        href={selectedProject.links?.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] text-[10px] uppercase tracking-widest"
                      >
                        <FaExternalLinkAlt size={12} /> Live Demo
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Content */}
              <div className="space-y-8 md:space-y-12 pb-8">
                <section>
                  <div className="flex items-center gap-4 mb-4 md:mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white uppercase italic tracking-tighter">The <span className="text-cyan-500">Overview</span></h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-sm md:text-lg">{selectedProject.desc}</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <section className="bg-gradient-to-br from-red-500/5 to-transparent border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <FaTimes size={60} className="text-red-500" />
                    </div>
                    <div className="flex items-center gap-3 text-red-400 font-bold uppercase tracking-widest text-[10px] mb-3 md:mb-4">
                      <FaTimes size={10} /> Core Challenge
                    </div>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed relative z-10">{selectedProject.coreChallenge || "N/A"}</p>
                  </section>

                  <section className="bg-gradient-to-br from-cyan-500/5 to-transparent border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <FaLightbulb size={60} className="text-cyan-500" />
                    </div>
                    <div className="flex items-center gap-3 text-cyan-400 font-bold uppercase tracking-widest text-[10px] mb-3 md:mb-4">
                      <FaLightbulb size={12} /> Technical Solution
                    </div>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed relative z-10">{selectedProject.technicalSolution || "N/A"}</p>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main >
  );
}

const ProjectCard = ({ data, onClick }: { data: Project, onClick: () => void }) => (
  <div
    onClick={onClick}
    className="group cursor-pointer relative bg-[#0a1128]/60 border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]"
  >
    <div className="relative h-56 w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128] to-transparent z-10 opacity-60"></div>
      <Image
        src={data.images?.[0] || "/images/final.png"}
        alt={data.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute top-4 left-4 z-20 bg-black/60 px-3 py-1 rounded-full border border-white/10">
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
        <span className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-white transition-colors">View Mission Details <FaRocket className="text-xs text-cyan-500" /></span>
        <span className="text-cyan-400 hover:text-cyan-300 transition-colors ml-auto font-bold flex items-center gap-2">Explore <FaChevronRight className="text-xs" /></span>
      </div>
    </div>
  </div>
);

// We need to import FaChevronRight but it was not in the original imports
// I'll add it to the imports above.