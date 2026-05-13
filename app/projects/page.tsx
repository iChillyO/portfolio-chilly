"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaGithub, FaExternalLinkAlt, FaFolderOpen, FaCode, FaPaintBrush, FaMobileAlt, FaSpinner, FaTimes, FaCalendarAlt, FaUser, FaRocket, FaLightbulb, FaChevronRight, FaChevronLeft } from "react-icons/fa";
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
    <main className="min-h-screen w-full bg-deep-bg font-sans select-none overflow-x-hidden relative text-white pt-28 md:pt-36 pb-16">

      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto section-padding relative z-10">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Portfolio</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4">
            My <span className="text-gradient-primary">Projects</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            A showcase of things I&apos;ve built, designed, and shipped.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                activeCategory === cat.name
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "bg-white/5 text-slate-400 border border-white/[0.06] hover:text-white hover:bg-white/10"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            <span className="text-violet-400 font-mono text-sm tracking-widest">Loading projects...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard key={project._id} data={project} onClick={() => setSelectedProject(project)} />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-slate-500 text-lg">No projects in this category yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-8 bg-black/90 backdrop-blur-md"
          onClick={() => { setSelectedProject(null); setCurrentImgIndex(0); }}
        >
          <div
            className="bg-surface border border-white/[0.08] w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-3xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-30 bg-surface/90 backdrop-blur-xl border-b border-white/[0.06] p-4 md:p-6 flex justify-between items-center">
              <div>
                <span className="text-violet-400 text-xs font-semibold tracking-widest uppercase mb-1 block">{selectedProject.category}</span>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{selectedProject.title}</h2>
              </div>
              <button
                onClick={() => { setSelectedProject(null); setCurrentImgIndex(0); }}
                className="p-2.5 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-white/[0.06] hover:border-red-500/30"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="p-4 md:p-10">
              {/* Media & Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-10">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="relative aspect-video bg-deep-bg rounded-xl overflow-hidden border border-white/[0.06]">
                    {selectedProject.images && selectedProject.images.length > 0 ? (
                      <>
                        <Image
                          src={selectedProject.images[currentImgIndex] || "/images/final.png"}
                          alt={`${selectedProject.title} - ${currentImgIndex + 1}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {selectedProject.images.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImgIndex((prev) => (prev === 0 ? selectedProject.images!.length - 1 : prev - 1));
                              }}
                              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-violet-500/80 text-white rounded-lg transition-all"
                            >
                              <FaChevronLeft size={12} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImgIndex((prev) => (prev === selectedProject.images!.length - 1 ? 0 : prev + 1));
                              }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-violet-500/80 text-white rounded-lg transition-all"
                            >
                              <FaChevronRight size={12} />
                            </button>
                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-medium text-violet-300">
                              {currentImgIndex + 1} / {selectedProject.images.length}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <Image src="/images/final.png" alt="Fallback" fill className="object-contain" />
                    )}
                  </div>

                  {/* Dots */}
                  {selectedProject.images && selectedProject.images.length > 1 && (
                    <div className="flex justify-center gap-1.5">
                      {selectedProject.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImgIndex(i)}
                          className={`h-1.5 rounded-full transition-all ${currentImgIndex === i ? "bg-violet-500 w-5" : "bg-white/10 w-1.5"}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Info */}
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <InfoBox icon={<FaUser size={10} />} label="Client" value={selectedProject.clientName || "N/A"} />
                    <InfoBox icon={<FaCalendarAlt size={10} />} label="Timeline" value={selectedProject.timeline || "N/A"} />
                  </div>

                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 text-violet-400 text-[10px] font-semibold uppercase tracking-widest mb-3">
                      <FaRocket size={10} /> Role & Stack
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed mb-4">{selectedProject.roleStack || "N/A"}</p>
                    <div className="flex flex-wrap gap-2">
                      {(selectedProject.tech || []).map((t, i) => (
                        <span key={i} className="text-[10px] font-medium text-violet-300 bg-violet-500/10 px-2.5 py-1 rounded-md border border-violet-500/20">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <a
                      href={selectedProject.links?.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/[0.08] text-white font-semibold py-3 rounded-xl transition-all text-xs"
                    >
                      <FaGithub size={14} /> Repository
                    </a>
                    <a
                      href={selectedProject.links?.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-violet-500/20 text-xs"
                    >
                      <FaExternalLinkAlt size={12} /> Live Demo
                    </a>
                  </div>
                </div>
              </div>

              {/* Detailed Content */}
              <div className="space-y-8 pb-4">
                <section>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    Overview
                    <span className="h-px flex-1 bg-gradient-to-r from-violet-500/30 to-transparent" />
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{selectedProject.desc}</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-card p-6 border-l-2 border-l-amber-500/50">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
                      <FaLightbulb size={12} /> Challenge
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedProject.coreChallenge || "N/A"}</p>
                  </div>

                  <div className="glass-card p-6 border-l-2 border-l-violet-500/50">
                    <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-widest mb-3">
                      <FaRocket size={12} /> Solution
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedProject.technicalSolution || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// --- HELPER COMPONENTS ---

const InfoBox = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="glass-card p-4">
    <div className="flex items-center gap-2 text-violet-400 text-[10px] font-semibold uppercase tracking-widest mb-1">
      {icon} {label}
    </div>
    <div className="text-white font-semibold text-sm truncate">{value}</div>
  </div>
);

const ProjectCard = ({ data, onClick }: { data: Project; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="group cursor-pointer glass-card-hover overflow-hidden"
  >
    {/* Image */}
    <div className="relative h-52 w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10 opacity-80" />
      <Image
        src={data.images?.[0] || "/images/final.png"}
        alt={data.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute top-4 left-4 z-20">
        <span className="text-[10px] font-semibold text-violet-300 bg-violet-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-violet-500/20">
          {data.category}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="p-6">
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">{data.title}</h3>
      <p className="text-sm text-slate-400 mb-5 line-clamp-2 leading-relaxed">{data.desc}</p>

      {/* Tech Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {(data.tech || []).slice(0, 4).map((t, i) => (
          <span key={i} className="text-[10px] font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/[0.06]">{t}</span>
        ))}
        {(data.tech || []).length > 4 && (
          <span className="text-[10px] font-medium text-slate-500 px-2 py-1">+{data.tech.length - 4}</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
        <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">View details</span>
        <FaArrowIcon />
      </div>
    </div>
  </div>
);

const FaArrowIcon = () => (
  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-500/10 text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300">
    <FaChevronRight size={10} />
  </div>
);
