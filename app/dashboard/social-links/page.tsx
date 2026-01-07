"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaSave, FaSpinner, FaExternalLinkAlt, FaDiscord, FaTwitter, FaInstagram, FaGoogle, FaLinkedin, FaGithub, FaYoutube, FaTwitch } from "react-icons/fa";
import { ProfileData } from "@/types";

// Helper to get icon based on platform name
const getIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("discord")) return <FaDiscord />;
  if (p.includes("twitter") || p.includes("x")) return <FaTwitter />;
  if (p.includes("instagram")) return <FaInstagram />;
  if (p.includes("google") || p.includes("mail")) return <FaGoogle />;
  if (p.includes("linkedin")) return <FaLinkedin />;
  if (p.includes("github")) return <FaGithub />;
  if (p.includes("youtube")) return <FaYoutube />;
  if (p.includes("twitch")) return <FaTwitch />;
  return <FaExternalLinkAlt />;
};

export default function SocialLinksPage() {
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch Profile Data
  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSocialLinks(data.data.socialLinks || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      // We need to fetch the current profile first to not overwrite other fields
      // OR better, we just send a PATCH request if the API supported it.
      // But based on current API, we likely need to send the whole object or the API merges.
      // Let's assume the API merges or we fetch-then-update.
      // Given the `api/profile` PUT implementation: `{ ...body, lastSync: new Date() }`
      // It merges with `findOneAndUpdate` but if we only send `socialLinks`, it might not erase others?
      // Wait, `findOneAndUpdate({}, { ...body }, ...)` will replace fields present in body.
      // So if we send `{ socialLinks: [...] }`, it updates only socialLinks and keeps others intact?
      // Mongoose `findOneAndUpdate` with `$set` (implicit in top-level object keys) updates specific fields.
      // YES.

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socialLinks })
      });
      const data = await res.json();
      if (data.success) {
        setMessage("LINKS SAVED SUCCESSFULLY");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("FAILED TO SAVE");
      }
    } catch (err) {
      console.error(err);
      setMessage("ERROR SAVING");
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    setSocialLinks([...socialLinks, { platform: "New Platform", url: "https://" }]);
  };

  const removeLink = (index: number) => {
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    setSocialLinks(newLinks);
  };

  const updateLink = (index: number, field: "platform" | "url", value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);
  };

  if (loading) return <div className="text-cyan-500 p-8">LOADING DPLIKS...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 font-mono text-cyan-400">

      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-cyan-500/20 pb-8">
        <div>
          <h1 className="text-4xl text-white font-bold uppercase tracking-tighter mb-2">Social Uplinks</h1>
          <p className="text-xs text-cyan-700 uppercase tracking-[0.2em] font-bold">Manage External Connection Protocols</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {message && <div className="text-xs text-green-400 font-bold bg-green-500/10 px-3 py-1 rounded border border-green-500/30 animate-pulse">{message}</div>}
          <button onClick={handleSave} disabled={saving} className="bg-white hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-sm uppercase tracking-[0.1em] text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50">
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} {saving ? "SAVING..." : "COMMIT CHANGES"}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {socialLinks.map((link, idx) => (
          <div key={idx} className="bg-black/30 border border-cyan-500/20 p-6 rounded flex flex-col md:flex-row gap-6 items-start md:items-center group hover:border-cyan-500/50 transition-all">

            {/* Icon Preview */}
            <div className={`text-2xl pt-2 md:pt-0 w-12 h-12 flex items-center justify-center bg-black/50 rounded border border-white/5 ${link.url ? "text-cyan-400" : "text-gray-700"}`}>
              {getIcon(link.platform)}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Platform Name</label>
                <input
                  value={link.platform}
                  onChange={(e) => updateLink(idx, 'platform', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 p-3 text-white text-sm rounded focus:border-cyan-500 outline-none transition-colors"
                  placeholder="e.g. Twitter"
                />
              </div>
              <div>
                <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">URL Endpoint</label>
                <input
                  value={link.url}
                  onChange={(e) => updateLink(idx, 'url', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 p-3 text-cyan-300 text-sm rounded focus:border-cyan-500 outline-none transition-colors font-mono"
                  placeholder="https://..."
                />
              </div>
            </div>

            <button onClick={() => removeLink(idx)} className="text-red-500/50 hover:text-red-500 p-2 hover:bg-red-500/10 rounded transition-all">
              <FaTrash />
            </button>
          </div>
        ))}

        {/* Empty State */}
        {socialLinks.length === 0 && (
          <div className="text-center py-12 border border-dashed border-cyan-500/20 rounded opacity-50">
            NO UPLINKS DETECTED in current configuration.
          </div>
        )}

        <button onClick={addLink} className="w-full py-4 border border-dashed border-cyan-500/30 text-cyan-500/50 hover:text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/5 rounded uppercase tracking-widest text-sm font-bold transition-all flex items-center justify-center gap-2 mt-8">
          <FaPlus /> Initialize New Uplink
        </button>
      </div>

    </div>
  );
}
