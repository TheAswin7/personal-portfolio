import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, Mail, Phone, MapPin } from "lucide-react";

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CVModal({ isOpen, onClose }: CVModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 md:p-10"
          data-lenis-prevent
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[92dvh] flex flex-col bg-[#0d0d0f] border border-white/10 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden z-10"
          >
            {/* Top Bar with Actions */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-black/60 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]" />
                <span className="font-mono text-xs uppercase tracking-widest text-white/80 font-bold">
                  Curriculum Vitae — Aswin R
                </span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="/cv.pdf"
                  download="aswin_resume.pdf"
                  className="px-4 py-1.5 bg-orange-500 hover:bg-orange-400 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </a>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Resume Sheet Container (Scrollable) */}
            <div 
              className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-8 custom-scrollbar bg-neutral-950/50"
              data-lenis-prevent
            >
              <div className="max-w-[760px] mx-auto bg-white text-neutral-900 rounded-lg shadow-2xl p-6 sm:p-10 font-serif leading-relaxed text-[13.5px]">
                
                {/* Header */}
                <div className="text-center pb-3 border-b border-neutral-300">
                  <h1 className="text-3xl sm:text-4xl font-normal tracking-[0.1em] uppercase text-neutral-900 mb-1.5">
                    Aswin R
                  </h1>
                  <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-neutral-700 font-sans">
                    <span className="flex items-center gap-1">
                      <Phone size={11} className="text-neutral-500" /> +91 73971 09360
                    </span>
                    <span>|</span>
                    <a href="mailto:aswinr2k6@gmail.com" className="hover:underline flex items-center gap-1">
                      <Mail size={11} className="text-neutral-500" /> aswinr2k6@gmail.com
                    </a>
                    <span>|</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} className="text-neutral-500" /> Tamil Nadu, India
                    </span>
                    <span>|</span>
                    <a href="https://linkedin.com/in/raswin7" target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                      linkedin.com/in/raswin7
                    </a>
                    <span>|</span>
                    <a href="https://github.com/TheAswin7" target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                      github.com/TheAswin7
                    </a>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-800 pb-0.5 mb-2 font-sans">
                    Summary
                  </h2>
                  <p className="text-neutral-800 text-[12.5px] leading-relaxed text-justify">
                    Final-year Computer Science Engineering student (CGPA 8.11/10) with experience as a Software Developer and Software
                    Engineering Intern, seeking an entry-level Software Developer role. Built full-stack web applications with React, Django
                    REST Framework, and MySQL, including a multi-tenant SaaS platform with JWT-secured APIs, automated tests, and
                    CI. Skilled in debugging and Agile delivery; led a team to a Top 4 national hackathon finish.
                  </p>
                </div>

                {/* Education */}
                <div className="mt-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-800 pb-0.5 mb-2 font-sans">
                    Education
                  </h2>
                  
                  <div className="mb-2">
                    <div className="flex justify-between items-baseline font-bold text-neutral-900 text-[13px]">
                      <span>University College of Engineering, Nagercoil</span>
                      <span className="font-sans text-xs">2023 – 2027</span>
                    </div>
                    <div className="flex justify-between items-baseline italic text-neutral-700 text-xs">
                      <span>B.E. in Computer Science and Engineering; CGPA: 8.11 / 10</span>
                      <span>Nagercoil, Tamil Nadu</span>
                    </div>
                    <div className="text-[11.5px] text-neutral-600 font-sans mt-0.5">
                      <strong className="text-neutral-800">Relevant Coursework:</strong> Data Structures &amp; Algorithms, Operating Systems, Computer Networks, DBMS, OOP
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline font-bold text-neutral-900 text-[13px]">
                      <span>Arunachala School</span>
                      <span className="font-sans text-xs">2021 – 2023</span>
                    </div>
                    <div className="flex justify-between items-baseline italic text-neutral-700 text-xs">
                      <span>Higher Secondary Certificate — 89%</span>
                      <span>Tamil Nadu, India</span>
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div className="mt-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-800 pb-0.5 mb-2 font-sans">
                    Experience
                  </h2>

                  {/* Role 1 */}
                  <div className="mb-3">
                    <div className="flex justify-between items-baseline font-bold text-neutral-900 text-[13px]">
                      <span>Software Developer</span>
                      <span className="font-sans text-xs">Aug 2026 – Oct 2026</span>
                    </div>
                    <div className="italic text-neutral-700 text-xs mb-1">
                      Haio Creations (Startup)
                    </div>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-neutral-800 text-[12px] leading-relaxed text-justify">
                      <li>Contributed to building a responsive company website, developing and refining frontend pages and UI components with React and Tailwind CSS</li>
                      <li>Collaborated with the team to turn design requirements into working features, integrating the frontend with backend APIs and fixing bugs found during testing</li>
                      <li>Used Git and GitHub for version control and code reviews, shipping updates in an Agile workflow</li>
                    </ul>
                  </div>

                  {/* Role 2 */}
                  <div>
                    <div className="flex justify-between items-baseline font-bold text-neutral-900 text-[13px]">
                      <span>Software Engineering Intern (AI &amp; Data Science)</span>
                      <span className="font-sans text-xs">Jun 2026 – Jul 2026</span>
                    </div>
                    <div className="flex justify-between items-baseline italic text-neutral-700 text-xs mb-1">
                      <span>CapeStart – The Foundry (in partnership with Oliver G Foundation)</span>
                      <span>Nagercoil, Tamil Nadu</span>
                    </div>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-neutral-800 text-[12px] leading-relaxed text-justify">
                      <li>Engineered 5+ RESTful API endpoints with Django REST Framework and MySQL for a multi-tenant Student Attendance Management System serving ~50 students, across the full SDLC</li>
                      <li>Implemented JWT authentication and role-based authorization on every endpoint; optimized Django ORM queries for real-time attendance data access</li>
                      <li>Tested and debugged APIs with Postman across four weekly Agile sprints in a 4-member team using Git and GitHub; supported cloud deployment and earned an 85% final assessment score</li>
                    </ul>
                  </div>
                </div>

                {/* Projects */}
                <div className="mt-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-800 pb-0.5 mb-2 font-sans">
                    Projects
                  </h2>

                  {/* Project 1 */}
                  <div className="mb-3">
                    <div className="font-bold text-neutral-900 text-[13px]">
                      Fabsence – Multi-Tenant AI-Driven Face Recognition Attendance SaaS
                    </div>
                    <div className="italic text-neutral-600 text-[11.5px] font-sans mb-1">
                      Python, Django REST Framework, React, MySQL, JWT, face-api.js
                    </div>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-neutral-800 text-[12px] leading-relaxed text-justify">
                      <li>Architected a full-stack, multi-tenant SaaS attendance platform (React 18, Django REST Framework, MySQL) with server-side tenant isolation across 18+ relational tables, 8 Django apps, and Admin, Faculty, and Student dashboards</li>
                      <li>Built a consent-based face-recognition attendance workflow using face-api.js (on-device detection, 128-dimensional descriptors) with a server-side matching API and mandatory faculty review</li>
                      <li>Secured the API with JWT refresh-token blacklisting and role-based permissions, fixing findings from an architecture review; wrote 1,200+ lines of automated tests (APITestCase) and a GitHub Actions CI pipeline</li>
                    </ul>
                  </div>

                  {/* Project 2 */}
                  <div>
                    <div className="font-bold text-neutral-900 text-[13px]">
                      Opportunity Pulse – Unified Opportunities Platform
                    </div>
                    <div className="italic text-neutral-600 text-[11.5px] font-sans mb-1">
                      React, FastAPI, MySQL
                    </div>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-neutral-800 text-[12px] leading-relaxed text-justify">
                      <li>Developed a platform unifying internships, jobs, symposiums, and hackathons on a FastAPI backend with MySQL and a React frontend; led Team FabFour to a Top 4 finish and the Best Presenter Award at CapeXtreme 2026</li>
                    </ul>
                  </div>
                </div>

                {/* Technical Skills */}
                <div className="mt-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-800 pb-0.5 mb-2 font-sans">
                    Technical Skills
                  </h2>
                  <div className="space-y-1 text-[12px] font-sans leading-normal">
                    <div><strong className="text-neutral-900 font-serif text-[12.5px]">Languages:</strong> Python, JavaScript, SQL</div>
                    <div><strong className="text-neutral-900 font-serif text-[12.5px]">Frontend:</strong> React, HTML5, CSS3, Bootstrap, Tailwind CSS</div>
                    <div><strong className="text-neutral-900 font-serif text-[12.5px]">Backend &amp; APIs:</strong> Django, Django REST Framework, FastAPI, RESTful API Design, JWT Authentication, RBAC</div>
                    <div><strong className="text-neutral-900 font-serif text-[12.5px]">Databases:</strong> MySQL, MongoDB</div>
                    <div><strong className="text-neutral-900 font-serif text-[12.5px]">Tools &amp; Platforms:</strong> Git, GitHub, GitHub Actions (CI/CD), Linux/Unix, Postman, VS Code</div>
                    <div><strong className="text-neutral-900 font-serif text-[12.5px]">AI Dev Tools:</strong> Claude Code, Antigravity, Cursor</div>
                    <div><strong className="text-neutral-900 font-serif text-[12.5px]">CS Fundamentals:</strong> Data Structures &amp; Algorithms, Operating Systems, Computer Networks, DBMS, OOP</div>
                    <div><strong className="text-neutral-900 font-serif text-[12.5px]">Practices:</strong> Agile/Scrum, SDLC, Debugging &amp; Troubleshooting, Automated Testing, Version Control, Code Review</div>
                  </div>
                </div>

                {/* Achievements & Certifications */}
                <div className="mt-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-800 pb-0.5 mb-2 font-sans">
                    Achievements &amp; Certifications
                  </h2>
                  <ul className="list-disc list-outside ml-4 space-y-1 text-neutral-800 text-[12px] leading-relaxed">
                    <li>Presented a research paper on Machine Learning and Deep Learning techniques for Cancer Diagnosis at ICRTAC 2024</li>
                    <li>Received Cyber Safety Innovation Recognition from StartupTN and Kanniyakumari District Police</li>
                    <li>Certifications: Python for Data Science (NPTEL); e-Yantra Robotics Workshop (IIT Bombay); Prompt Engineering (ALO Info-Tech)</li>
                  </ul>
                </div>

              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
