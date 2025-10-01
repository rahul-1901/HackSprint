import {
  LayoutDashboard, Award, FileText, Scale, CircleHelp, Info, MessagesSquare, NotebookPen, Target as ThemeIcon
} from "lucide-react";

export const SidebarNav = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "themes", label: "Themes", icon: ThemeIcon },
    { id: "prizes", label: "Prizes", icon: Award },
    { id: "submission-guide", label: "Submission", icon: NotebookPen },
    { id: "judging", label: "Judging", icon: Scale },
    { id: "rules", label: "Rules", icon: FileText },
    { id: "faqs", label: "FAQs", icon: CircleHelp },
    { id: "about", label: "About", icon: Info },
    { id: "refMaterial", label: "Reference Material", icon: FileText },
    { id: "discussion", label: "Discussion", icon: MessagesSquare },
  ];

  return (
    <aside className="w-full lg:w-64 lg:min-h-[calc(100vh-88px)] lg:sticky top-[88px] shrink-0">
      <div className="p-4 lg:p-6 h-full bg-gray-900/50 backdrop-blur-md border-b lg:border-r lg:border-b-0 border-green-500/20">
        <h3 className="hidden lg:block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Navigation
        </h3>
        <ul className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-1 lg:space-x-0 lg:space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {sections.map((section) => (
            <li key={section.id} className="flex-shrink-0">
              <button
                onClick={() => onSectionChange(section.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 group font-medium cursor-pointer ${
                  activeSection === section.id
                    ? "bg-green-400/10 text-green-300"
                    : "text-gray-400 hover:text-white hover:bg-green-500/5"
                }`}
              >
                <section.icon className={`w-4 h-4 transition-colors ${activeSection === section.id ? 'text-green-400' : 'text-gray-500 group-hover:text-white'}`} />
                <span>{section.label}</span>
                 {activeSection === section.id && (
                  <div className="hidden lg:block ml-auto w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                 )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};