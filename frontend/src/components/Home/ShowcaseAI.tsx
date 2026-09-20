import { useState } from "react";
import { SparklesIcon } from "lucide-react";

export default function ShowcaseAI() {
    const [activeTab, setActiveTab] = useState("linkedin");

    const contentMap: Record<string, string> = {
        linkedin: "Exciting news! We're thrilled to announce the launch of SocialFlow. This marks a significant milestone in our journey to streamline social media management for professionals and teams alike. #Innovation #SocialMediaManagement",
        twitter: "We just launched SocialFlow! 🚀 Say goodbye to manual posting and hello to automated growth. Create once, publish everywhere. Check it out 👇 #SaaS #Launch",
        instagram: "The wait is over! 🎉 Meet SocialFlow – your new favorite social media sidekick. We've built this to help you save time and create better content. Tap the link in our bio to see it in action! ✨ #SocialMediaMarketing #NewTool"
    };

    return (
        <section id="ai-composer" className="py-24 bg-white border-b border-slate-100 overflow-hidden">
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left: Copy */}
                    <div>
                        <div className="inline-flex items-center gap-2 bg-primary-soft border border-primary-border text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                            <SparklesIcon className="size-4" />
                            AI Content Generation
                        </div>
                        <h2 className="font-sans font-semibold text-4xl sm:text-5xl tracking-tight text-slate-900 mb-6">
                            One idea. <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">Different voices.</span>
                        </h2>
                        <p className="text-lg text-slate-500 leading-relaxed mb-8">
                            Don't sound like a robot. Our AI tailors your core message into platform-native content—professional for LinkedIn, snappy for X, and visual for Instagram.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
                                <p className="text-slate-600">Start with a simple prompt or a draft idea.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
                                <p className="text-slate-600">Select your desired tone and target platforms.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
                                <p className="text-slate-600">Let the AI generate perfectly formatted posts, complete with hashtags.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: UI Showcase */}
                    <div className="relative">
                        {/* Decorative background blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.08)_0%,transparent_70%)] -z-10" />
                        
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
                            {/* Tabs */}
                            <div className="flex border-b border-slate-100 bg-slate-50/50">
                                <button 
                                    onClick={() => setActiveTab("linkedin")}
                                    className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'linkedin' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                                >
                                    LinkedIn
                                </button>
                                <button 
                                    onClick={() => setActiveTab("twitter")}
                                    className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'twitter' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                                >
                                    X / Twitter
                                </button>
                                <button 
                                    onClick={() => setActiveTab("instagram")}
                                    className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'instagram' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                                >
                                    Instagram
                                </button>
                            </div>

                            {/* Content Area */}
                            <div className="p-6 sm:p-8">
                                <div className="mb-4">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Generated Post</label>
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 min-h-[160px] relative transition-all">
                                        <p className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-wrap">{contentMap[activeTab]}</p>
                                        <div className="absolute bottom-3 right-3 opacity-30">
                                            <SparklesIcon className="size-5 text-primary" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-6">
                                    <div className="text-xs font-medium text-slate-400">Tone: <span className="text-slate-600">Professional</span></div>
                                    <div className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md shadow-sm hover:bg-primary-hover cursor-pointer transition-colors">Apply to Post</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
