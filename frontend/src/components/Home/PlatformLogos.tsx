import { useState } from "react";
import { PLATFORMS } from "../../assets/assets";

export default function PlatformLogos() {
    const [activePlatform, setActivePlatform] = useState<string>("linkedin");

    const contentMap: Record<string, { text: string; tags: string }> = {
        linkedin: {
            text: "Exciting news! We're thrilled to announce the launch of SocialFlow. This marks a significant milestone in our journey to streamline social media management for professionals and teams alike. Our new platform is designed to save you hours every week.",
            tags: "#Innovation #SocialMediaManagement #Productivity",
        },
        twitter: {
            text: "We just launched SocialFlow! 🚀 Say goodbye to manual posting and hello to automated growth. Create once, publish everywhere. Check it out 👇",
            tags: "#SaaS #Launch #Marketing",
        },
        instagram: {
            text: "The wait is over! 🎉 Meet SocialFlow – your new favorite social media sidekick. We've built this to help you save time and create better content.\n\nTap the link in our bio to see it in action! ✨",
            tags: "#SocialMediaMarketing #NewTool #ContentCreation",
        },
        facebook: {
            text: "We are incredibly excited to share our latest product with our community: SocialFlow. \n\nWe know how much time it takes to manage multiple pages and profiles. That's why we built a unified workspace to help you create and schedule posts seamlessly. Let us know what you think in the comments!",
            tags: "#SocialFlow #Community #TechLaunch",
        }
    };

    return (
        <section className="py-24 bg-slate-50 border-b border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            
            <div className="max-w-5xl mx-auto px-5 sm:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="font-sans font-semibold text-4xl sm:text-5xl tracking-tight text-slate-900 mb-6">
                        One workspace. <br className="sm:hidden"/> Every platform.
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Create content once and adapt it for each platform before you schedule and publish.
                    </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row">
                    
                    {/* Sidebar / Platform Tabs */}
                    <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-4 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                        {PLATFORMS.map((platform) => {
                            const isActive = activePlatform === platform.id;
                            return (
                                <button 
                                    key={platform.id}
                                    onClick={() => setActivePlatform(platform.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap md:whitespace-normal shrink-0 ${
                                        isActive 
                                        ? "bg-white shadow-sm border border-slate-200 text-primary" 
                                        : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900 border border-transparent"
                                    }`}
                                >
                                    <platform.icon className={`size-5 ${isActive ? "text-primary" : "text-slate-400"}`} />
                                    <span className="font-medium text-sm">{platform.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Preview Area */}
                    <div className="flex-1 p-6 md:p-10 relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,rgba(79,70,229,0.05)_0%,transparent_70%)] pointer-events-none" />
                        
                        <div className="max-w-lg mx-auto">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                                    {(() => {
                                        const ActiveIcon = PLATFORMS.find(p => p.id === activePlatform)?.icon;
                                        return ActiveIcon ? <ActiveIcon className="size-5 text-slate-500" /> : null;
                                    })()}
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900 text-sm">SocialFlow Team</div>
                                    <div className="text-xs text-slate-500">Just now</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[15px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {contentMap[activePlatform]?.text}
                                </p>
                                <p className="text-[14px] text-primary/80 font-medium tracking-wide">
                                    {contentMap[activePlatform]?.tags}
                                </p>
                            </div>

                            {/* Image Placeholder */}
                            <div className="mt-6 aspect-video bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
                                <div className="text-slate-400 font-medium text-sm flex flex-col items-center gap-2">
                                    <div className="size-12 bg-slate-200 rounded-full flex items-center justify-center">
                                        <svg className="size-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    Media Attachment
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    );
}
