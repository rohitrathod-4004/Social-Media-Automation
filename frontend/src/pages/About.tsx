import { 
  BotIcon,
  Share2Icon,
  CalendarDaysIcon,
  SendIcon,
  UserIcon,
  Settings2Icon,
  LayersIcon,
  DatabaseIcon,
  CodeIcon,
  CpuIcon,
  SmartphoneIcon,
  Wand2Icon
} from "lucide-react";

const FlowNode = ({ icon: Icon, title, subtitle, borderClass = "border-slate-200", bgClass = "bg-white", textClass = "text-slate-800", subtitleClass = "text-slate-500", iconClass = "text-slate-500" }: any) => (
  <div className={`flex flex-col items-center justify-center p-4 ${bgClass} border ${borderClass} rounded-xl shadow-sm z-10 relative w-56 text-center mx-auto`}>
    {Icon && <Icon className={`size-5 mb-2 ${iconClass}`} />}
    <span className={`text-sm font-semibold ${textClass}`}>{title}</span>
    {subtitle && <span className={`text-xs mt-1 leading-relaxed ${subtitleClass}`}>{subtitle}</span>}
  </div>
);

const VerticalConnector = () => (
  <div className="flex justify-center w-full my-2">
    <div className="h-6 w-px bg-slate-300 relative">
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-solid border-t-4 border-l-4 border-r-4 border-transparent border-t-slate-300 w-0 h-0"></div>
    </div>
  </div>
);

const About = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6 lg:px-8 h-full overflow-y-auto">
      
      {/* 2. Hero section */}
      <div className="mb-20 text-center md:text-left max-w-3xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">About the Platform</h1>
        <p className="text-xl text-slate-700 mb-4 font-medium">
          Create, customize, schedule, and publish social media content from one workspace.
        </p>
        <p className="text-lg text-slate-500 mb-8 leading-relaxed">
          Generate platform-aware content, refine each version, and manage your publishing workflow from a single workspace.
        </p>
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          {["AI-Powered", "Multi-Platform", "Scheduling", "Publishing"].map(chip => (
            <span key={chip} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold tracking-wide">
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-24">
        
        {/* 3. What the platform does */}
        <section>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
            {[
              { icon: Wand2Icon, title: "Create", desc: "Generate content using AI based on your topic, tone, and selected platforms." },
              { icon: Settings2Icon, title: "Customize", desc: "Review and edit platform-specific versions before publishing." },
              { icon: CalendarDaysIcon, title: "Schedule", desc: "Save drafts or schedule posts for a future date and time." },
              { icon: SendIcon, title: "Publish", desc: "Publish through connected social accounts and recover failed posts when needed." }
            ].map((stage, i) => (
              <div key={stage.title} className="flex flex-col md:flex-row items-center gap-4 md:gap-2 flex-1">
                <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 p-4">
                  <div className="size-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-4">
                    <stage.icon className="size-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">{stage.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{stage.desc}</p>
                </div>
                {i < 3 && (
                  <>
                    <svg className="hidden md:block w-8 h-8 shrink-0 text-slate-400 mx-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <polyline points="15 5 22 12 15 19"></polyline>
                    </svg>
                    <svg className="block md:hidden w-8 h-8 shrink-0 text-slate-400 my-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="2" x2="12" y2="22"></line>
                      <polyline points="5 15 12 22 19 15"></polyline>
                    </svg>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section className="border-t border-slate-100 pt-16">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-500">From connecting your accounts to publishing content, every post follows a simple workflow.</p>
          </div>
          
          <div className="relative pl-4 md:pl-0">
            {/* Timeline Line */}
            <div className="absolute left-[27px] md:left-[39px] top-4 bottom-4 w-px bg-slate-200"></div>
            
            <div className="space-y-12">
              {[
                { num: "01", title: "Connect Accounts", desc: "Connect supported social accounts through the platform's publishing integration." },
                { num: "02", title: "Generate Content", desc: "Enter a topic, choose a tone and platforms, and generate AI-assisted content." },
                { num: "03", title: "Customize for Platforms", desc: "Review and edit the version generated for each selected platform." },
                { num: "04", title: "Save or Schedule", desc: "Keep the post as a draft or schedule it for a future date and time." },
                { num: "05", title: "Publish & Recover", desc: "Publish through connected accounts and recover failed posts by editing and retrying them." }
              ].map((step) => (
                <div key={step.num} className="relative flex items-start gap-6 md:gap-8 group">
                  <div className="size-14 md:size-20 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors group-hover:border-slate-100">
                    <span className="text-lg md:text-2xl font-light text-slate-400">{step.num}</span>
                  </div>
                  <div className="pt-2 md:pt-4">
                    <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-2">{step.title}</h3>
                    <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-2xl">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. MAIN ARCHITECTURE SECTION (Content Journey) */}
        <section className="bg-slate-50 rounded-3xl p-6 md:p-12 border border-slate-200 overflow-hidden">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">How Your Content Moves Through the System</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">From AI generation to platform-specific publishing, every post moves through a single managed lifecycle.</p>
          </div>

          <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
            
            {/* USER */}
            <FlowNode icon={UserIcon} title="USER" />
            <VerticalConnector />

            {/* React Frontend */}
            <FlowNode icon={CodeIcon} title="React Frontend" subtitle="React, TypeScript, Vite" borderClass="border-blue-200" bgClass="bg-blue-50" />
            <VerticalConnector />

            {/* Node + Express */}
            <FlowNode icon={CpuIcon} title="Node + Express" subtitle="REST API / Business Logic" borderClass="border-green-200" bgClass="bg-green-50" />

            {/* Desktop: Node -> MongoDB & Gemini (Branching) */}
            <div className="hidden md:block w-full">
              <div className="h-6 w-px bg-slate-300 mx-auto"></div>
              
              <div className="grid grid-cols-2 w-full max-w-xl mx-auto">
                <div className="border-t-2 border-l-2 border-slate-300 h-6 rounded-tl-xl ml-[50%] relative">
                  <div className="absolute -bottom-2 -left-[5px] w-0 h-0 border-solid border-t-4 border-l-4 border-r-4 border-transparent border-t-slate-300"></div>
                </div>
                <div className="border-t-2 border-r-2 border-slate-300 h-6 rounded-tr-xl mr-[50%] relative -ml-[2px]">
                  <div className="absolute -bottom-2 -right-[5px] w-0 h-0 border-solid border-t-4 border-l-4 border-r-4 border-transparent border-t-slate-300"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-xl mx-auto">
                <div className="flex justify-center w-full">
                  <FlowNode icon={DatabaseIcon} title="MongoDB" subtitle="Data Persistence" borderClass="border-emerald-200" bgClass="bg-emerald-50" />
                </div>
                <div className="flex justify-center w-full">
                  <FlowNode icon={Wand2Icon} title="Gemini" subtitle="AI Content Generation" borderClass="border-purple-200" bgClass="bg-purple-50" />
                </div>
              </div>

              {/* Converge back to Platform Content */}
              <div className="grid grid-cols-2 w-full max-w-xl mx-auto">
                <div className="border-b-2 border-l-2 border-slate-300 h-6 rounded-bl-xl ml-[50%]"></div>
                <div className="border-b-2 border-r-2 border-slate-300 h-6 rounded-br-xl mr-[50%] -ml-[2px]"></div>
              </div>
              <div className="h-6 w-px bg-slate-300 mx-auto relative">
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-solid border-t-4 border-l-4 border-r-4 border-transparent border-t-slate-300"></div>
              </div>
            </div>

            {/* Mobile: Node -> MongoDB -> Gemini -> Platform Content */}
            <div className="flex md:hidden flex-col items-center w-full">
              <VerticalConnector />
              <FlowNode icon={DatabaseIcon} title="MongoDB" subtitle="Data Persistence" borderClass="border-emerald-200" bgClass="bg-emerald-50" />
              <VerticalConnector />
              <FlowNode icon={Wand2Icon} title="Gemini" subtitle="AI Content Generation" borderClass="border-purple-200" bgClass="bg-purple-50" />
              <VerticalConnector />
            </div>

            {/* PLATFORM-SPECIFIC CONTENT */}
            <FlowNode icon={LayersIcon} title="Platform Content" subtitle="Drafts / Scheduled" />

            {/* Desktop: Platform Content -> LinkedIn, Instagram, X */}
            <div className="hidden md:block w-full">
              <div className="h-6 w-px bg-slate-300 mx-auto"></div>

              <div className="grid grid-cols-3 w-full max-w-3xl mx-auto">
                <div className="border-t-2 border-l-2 border-slate-300 h-6 rounded-tl-xl ml-[50%] relative">
                  <div className="absolute -bottom-2 -left-[5px] w-0 h-0 border-solid border-t-4 border-l-4 border-r-4 border-transparent border-t-slate-300"></div>
                </div>
                <div className="w-full flex justify-center relative">
                  <div className="w-full border-t-2 border-slate-300 h-px absolute top-0"></div>
                  <div className="h-6 w-px bg-slate-300 relative">
                    <div className="absolute -bottom-2 -left-[4px] w-0 h-0 border-solid border-t-4 border-l-4 border-r-4 border-transparent border-t-slate-300"></div>
                  </div>
                </div>
                <div className="border-t-2 border-r-2 border-slate-300 h-6 rounded-tr-xl mr-[50%] relative -ml-[2px]">
                  <div className="absolute -bottom-2 -right-[5px] w-0 h-0 border-solid border-t-4 border-l-4 border-r-4 border-transparent border-t-slate-300"></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 w-full max-w-3xl mx-auto">
                <div className="flex justify-center"><FlowNode title="LinkedIn" subtitle="Professional version" /></div>
                <div className="flex justify-center"><FlowNode title="Instagram" subtitle="Engaging + Hashtags" /></div>
                <div className="flex justify-center"><FlowNode title="X (Twitter)" subtitle="Concise version" /></div>
              </div>

              {/* Converge from Platforms to Zernio */}
              <div className="grid grid-cols-3 w-full max-w-3xl mx-auto">
                <div className="border-b-2 border-l-2 border-slate-300 h-6 rounded-bl-xl ml-[50%]"></div>
                <div className="w-full flex justify-center relative">
                  <div className="w-full border-b-2 border-slate-300 h-6 border-transparent absolute bottom-0 border-b-slate-300"></div>
                  <div className="h-6 w-px bg-slate-300"></div>
                </div>
                <div className="border-b-2 border-r-2 border-slate-300 h-6 rounded-br-xl mr-[50%] -ml-[2px]"></div>
              </div>
              <div className="h-6 w-px bg-slate-300 mx-auto relative">
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-solid border-t-4 border-l-4 border-r-4 border-transparent border-t-slate-300"></div>
              </div>
            </div>

            {/* Mobile: Platform Content -> LinkedIn -> Instagram -> X */}
            <div className="flex md:hidden flex-col items-center w-full">
              <VerticalConnector />
              <FlowNode title="LinkedIn" subtitle="Professional version" />
              <VerticalConnector />
              <FlowNode title="Instagram" subtitle="Engaging + Hashtags" />
              <VerticalConnector />
              <FlowNode title="X (Twitter)" subtitle="Concise version" />
              <VerticalConnector />
            </div>

            {/* Zernio */}
            <FlowNode icon={Share2Icon} title="Zernio" subtitle="OAuth & Publishing" borderClass="border-orange-200" bgClass="bg-orange-50" />
            <VerticalConnector />

            {/* Connected Accounts */}
            <FlowNode 
              icon={SmartphoneIcon} 
              title="Connected Accounts" 
              bgClass="bg-slate-900" 
              borderClass="border-slate-800" 
              textClass="text-white"
              subtitleClass="text-slate-400"
              iconClass="text-slate-400"
            />
            
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 border-t border-slate-100 pt-16">
          
          {/* 5. Technology */}
          <section className="md:col-span-2">
            <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-6">Powered By</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <CodeIcon className="size-4 text-slate-400 mb-3" />
                <h4 className="text-xs font-semibold text-slate-800 uppercase mb-2">Frontend</h4>
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>React</li>
                  <li>TypeScript</li>
                  <li>Vite</li>
                  <li>Tailwind CSS</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <CpuIcon className="size-4 text-slate-400 mb-3" />
                <h4 className="text-xs font-semibold text-slate-800 uppercase mb-2">Backend</h4>
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>Node.js</li>
                  <li>Express</li>
                  <li>REST APIs</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <DatabaseIcon className="size-4 text-slate-400 mb-3" />
                <h4 className="text-xs font-semibold text-slate-800 uppercase mb-2">Data & Media</h4>
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>MongoDB</li>
                  <li>Mongoose</li>
                  <li>Cloudinary</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <BotIcon className="size-4 text-slate-400 mb-3" />
                <h4 className="text-xs font-semibold text-slate-800 uppercase mb-2">AI & Pub</h4>
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>Gemini</li>
                  <li>Zernio</li>
                </ul>
              </div>

            </div>
          </section>

          {/* 6. Future Scope */}
          <section className="md:col-span-1">
            <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-6">Future Scope</h2>
            <p className="text-xs text-slate-400 mb-4 uppercase tracking-wider">Planned Enhancements</p>
            <ul className="space-y-4">
              {[
                "Analytics and engagement tracking",
                "Additional social platforms",
                "Bulk scheduling",
                "Calendar-based planning",
                "AI-assisted performance insights"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                  <div className="mt-0.5 size-4 rounded-full border-2 border-slate-200 flex-shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
};

export default About;
