export const SidebarNav = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: "overview", label: "Overview", icon: "" },
    { id: "themes", label: "Themes", icon: "" },
    { id: "prizes", label: "Prizes", icon: "" },
    { id: "submission-guide", label: "Submission Guide", icon: "" },
    { id: "judging", label: "Judging Criteria", icon: "" },
    { id: "rules", label: "Rules", icon: "" },
    { id: "faqs", label: "FAQs", icon: "" },
    { id: "about", label: "About us", icon: "" },
    { id: "discussion", label: "Discussion", icon: "" },
  ];

  return (
    // Responsive classes change layout, width, and positioning based on screen size
    <nav className="w-full lg:w-72 lg:min-h-screen lg:sticky top-16 bg-surface/30 backdrop-blur-sm border-b lg:border-r lg:border-b-0 border-green-500">
      <div className="p-4 lg:p-6">
        {/* Hide the "Navigation" heading on small screens */}
        <h3 className="hidden lg:flex text-lg font-bold mb-6 text-white items-center gap-2">
          <span className="w-2 h-2 bg-hero-primary rounded-full"></span>
          Navigation
        </h3>
        
        {/* List layout changes from horizontal scroll to vertical list */}
        <ul className="flex flex-row lg:flex-col overflow-x-auto space-x-2 lg:space-x-0 lg:space-y-1">
          {sections.map((section, index) => (
            <li key={section.id} className="flex-shrink-0">
              <button
                onClick={() => onSectionChange(section.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 group border cursor-pointer font-bold ${
                  activeSection === section.id
                    ? "bg-hero-primary/20 text-white border-green-500 shadow-lg shadow-hero-primary/10"
                    : "text-white hover:text-white hover:bg-surface-hover lg:hover:translate-x-1 border-green-500"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-base group-hover:scale-110 transition-transform duration-200">
                  {section.icon}
                </span>
                <span>{section.label}</span>
                {activeSection === section.id && (
                  <div className="hidden lg:block ml-auto w-2 h-2 bg-hero-primary rounded-full animate-pulse"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
        
        {/* Hide the footer on small screens */}
        <div className="hidden lg:block mt-8 pt-6 border-t border-green-500">
          <div className="text-xs text-white font-bold text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-1 h-1 bg-hero-primary rounded-full animate-pulse"></div>
              <span>Event Details</span>
              <div
                className="w-1 h-1 bg-hero-secondary rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};