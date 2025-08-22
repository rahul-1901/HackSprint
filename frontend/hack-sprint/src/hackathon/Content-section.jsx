import { useState } from "react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Clock, Code, Users, ChevronDown, ChevronUp } from "lucide-react";

export const ContentSection = ({ activeSection, hackathon }) => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-US", {
      weekday: "short", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true
    });

  const SectionCard = ({ children, className = "" }) => (
    <div
      className={`bg-gray-900/70 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 hover:border-green-400/30 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
  
  const SectionHeader = ({ children }) => (
      <h3 className="text-3xl font-bold text-white mb-6">{children}</h3>
  );

  // Component for sections with standard text content
  const SimpleContentSection = ({ title, content }) => (
    <div>
      <SectionHeader>{title}</SectionHeader>
      <SectionCard>
        <div className="text-gray-300 whitespace-pre-line leading-relaxed prose max-w-none">
          {content || `No ${title.toLowerCase()} information provided.`}
        </div>
      </SectionCard>
    </div>
  );

  // NEW: Component specifically for sections with array content to display as a list
  const ListContentSection = ({ title, content }) => {
    const isContentAvailable = Array.isArray(content) && content.length > 0;
    return (
      <div>
        <SectionHeader>{title}</SectionHeader>
        <SectionCard>
          {isContentAvailable ? (
            <ul className="list-disc list-inside space-y-3 text-gray-300 prose max-w-none">
              {content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">
              {`No ${title.toLowerCase()} information provided.`}
            </p>
          )}
        </SectionCard>
      </div>
    );
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-8">
            <SectionCard>
                <h4 className="text-xl font-bold text-white mb-4">Description</h4>
                <p className="text-gray-300 leading-relaxed prose max-w-none">{hackathon.description}</p>
            </SectionCard>
            <SectionCard>
              <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-400" /> Event Timeline
              </h4>
              <div className="relative pl-6 space-y-8 border-l-2 border-green-500/20">
                <div className="absolute -left-[11px] top-1 w-5 h-5 bg-green-400 rounded-full border-4 border-gray-900"></div>
                <div className="absolute -left-[11px] bottom-1 w-5 h-5 bg-green-500 rounded-full border-4 border-gray-900"></div>
                <div>
                  <div className="font-bold text-white">Registration & Start</div>
                  <div className="text-gray-400 text-sm">{formatDateTime(hackathon.startDate)}</div>
                </div>
                <div>
                  <div className="font-bold text-white">Submission Deadline</div>
                  <div className="text-gray-400 text-sm">{formatDateTime(hackathon.endDate)}</div>
                </div>
              </div>
            </SectionCard>
            <div className="grid md:grid-cols-2 gap-6">
              <SectionCard>
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-green-400" /> Difficulty
                </h4>
                <Badge className="bg-green-500/20 text-green-300 font-medium border-green-500/30 border">
                  {hackathon.difficulty}
                </Badge>
              </SectionCard>
              <SectionCard>
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" /> Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {hackathon.category?.map((cat, i) => (
                    <Badge key={i} className="bg-green-500/20 text-green-300 font-medium border-green-500/30 border">{cat}</Badge>
                  ))}
                </div>
              </SectionCard>
            </div>
            <SectionCard>
              <h4 className="text-xl font-bold text-white mb-4">Recommended Tech Stack</h4>
              <div className="flex flex-wrap gap-3">
                {hackathon.techStackUsed?.map((tech, i) => (
                  <span key={i} className="bg-gray-800 text-gray-300 border border-green-500/20 px-3 py-1.5 rounded-lg text-sm hover:bg-green-500/10 hover:text-white transition-colors duration-200">
                    {tech}
                  </span>
                ))}
              </div>
            </SectionCard>
          </div>
        );

      // --- UPDATED to use ListContentSection for array data ---
      case "themes":
        return <ListContentSection title="Themes" content={hackathon.themes} />;
      case "submission-guide":
        return <ListContentSection title="Submission Guide" content={hackathon.projectSubmission} />;
      case "judging":
        return <ListContentSection title="Judging Criteria" content={hackathon.evaluationCriteria} />;
      case "rules":
        return <ListContentSection title="Rules & Guidelines" content={hackathon.TandCforHackathon} />;

      // --- These sections still use SimpleContentSection for string data ---
      case "prizes":
        const prizeContent = hackathon.prizeMoney 
          ? `The total prize pool for this event is $${hackathon.prizeMoney.toLocaleString()}. Further details on prize distribution will be provided by the organizers.`
          : null;
        return <SimpleContentSection title="Prizes" content={prizeContent} />;
      case "about":
        return <SimpleContentSection title="About" content={hackathon.aboutUs} />;

      case "faqs":
        const rawFaqs = hackathon.FAQs || [];
        const faqs = [];
        for (let i = 0; i < rawFaqs.length; i += 2) {
          if (rawFaqs[i + 1]) {
            faqs.push({
              question: rawFaqs[i],
              answer: rawFaqs[i + 1]
            });
          }
        }
        return (
          <div>
            <SectionHeader>Frequently Asked Questions</SectionHeader>
            <div className="space-y-4">
              {faqs.length > 0 ? (
                faqs.map((faq, idx) => {
                  const isExpanded = expandedFAQ === idx;
                  return (
                    <div key={idx} className="border border-green-500/20 rounded-lg bg-gray-900/70 overflow-hidden transition-all duration-300">
                      <button
                        onClick={() => toggleFAQ(idx)}
                        className="w-full p-5 text-left flex items-center justify-between group hover:bg-green-500/5 cursor-pointer"
                      >
                        <p className="font-semibold text-lg text-white pr-4">{faq.question}</p>
                        <div className="text-green-400 flex-shrink-0 transition-transform duration-300">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-5 pb-5 border-t border-green-500/20 animate-fade-in">
                          <p className="text-gray-300 leading-relaxed pt-4 prose max-w-none">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <SectionCard><p className="text-gray-400">No FAQs provided for this event.</p></SectionCard>
              )}
            </div>
          </div>
        );
        
      case "discussion":
        return (
          <div>
            <SectionHeader>Community Discussion</SectionHeader>
            <SectionCard className="text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-green-400/50" />
              <p className="text-lg text-white font-semibold">Join the conversation!</p>
              <p className="text-gray-400 mt-2 mb-6">Connect with fellow participants on our Discord server.</p>
              <Button className="border border-green-500 text-white font-bold hover:bg-green-500/10 cursor-pointer">
                Join Discord Community
              </Button>
            </SectionCard>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-12">
            <p className="text-white font-bold">Section not found.</p>
          </div>
        );
    }
  };

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">{renderContent()}</div>
    </main>
  );
};