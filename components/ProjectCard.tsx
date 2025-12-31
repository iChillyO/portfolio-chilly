import Image from "next/image";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

interface ProjectCardProps {
  title: string;
  category: string;
  image: string; // Path to your image in /public
  tech: string[]; // Array of tech names like ['React', 'Node']
}

export default function ProjectCard({ title, category, image, tech }: ProjectCardProps) {
  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:border-accent-blue/50 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(79,70,229,0.3)]">
      
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        {/* We use a div bg as placeholder if image fails, but Image component is below */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-slate-900"></div>
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button className="p-3 bg-white rounded-full text-black hover:bg-accent-blue hover:text-white transition-colors">
            <FaGithub size={20} />
          </button>
          <button className="p-3 bg-white rounded-full text-black hover:bg-accent-blue hover:text-white transition-colors">
            <FaExternalLinkAlt size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <span className="text-xs font-bold text-accent-blue uppercase tracking-widest">{category}</span>
        <h3 className="text-xl font-bold text-white mt-2 mb-3 group-hover:text-accent-blue transition-colors">{title}</h3>
        
        {/* Tech Tags */}
        <div className="flex flex-wrap gap-2">
          {tech.map((t, i) => (
            <span key={i} className="text-xs font-medium text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}