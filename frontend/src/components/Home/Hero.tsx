import { Link } from "react-router-dom";
import { ArrowRightIcon, SparklesIcon, CalendarClockIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { PLATFORMS } from "../../assets/assets";

export default function Hero() {
    return (
        <section className="relative bg-white pt-16 pb-24 sm:pt-24 sm:pb-32 overflow-hidden border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
                    
                    {/* Left Side: Typography & CTAs */}
                    <div className="z-10 relative">
                        {/* Eyebrow */}
                        <div className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-4">
                            AI-Powered Social Media Scheduler
                        </div>

                        {/* Headline */}
                        <h1 className="font-sans text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                            Your social media, <br className="hidden sm:block" />
                            <span className="text-primary">all in one place.</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="mt-4 text-lg sm:text-xl text-slate-500 max-w-xl leading-relaxed">
                            Create platform-specific content, schedule your posts, and manage publishing from one workspace.
                        </p>

                        {/* CTAs */}
                        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                            <Link to="/login" className="w-full sm:w-auto">
                                <Button variant="primary" size="lg" className="w-full rounded-full shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-[15px] px-8 py-6">
                                    Start Creating <ArrowRightIcon className="size-4" />
                                </Button>
                            </Link>
                            <a href="#how-it-works" className="w-full sm:w-auto">
                                <Button variant="ghost" size="lg" className="w-full rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center text-[15px] px-8 py-6">
                                    Explore Workflow
                                </Button>
                            </a>
                        </div>
                        
                        {/* Footer Line */}
                        <div className="mt-10 text-sm font-medium text-slate-400">
                            Create &middot; Customize &middot; Schedule &middot; Publish
                        </div>
                    </div>

                    {/* Right Side: Product Preview Showcase */}
                    <div className="relative z-10 w-full max-w-2xl mx-auto lg:mr-0">
                        {/* Subtle Background Pattern for UI area */}
                        <div className="absolute inset-0 -m-12 bg-[radial-gradient(var(--color-slate-200)_1px,transparent_1px)] [background-size:20px_20px] opacity-40 -z-10" />
                        
                        {/* Main AI Composer Window */}
                        <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-col overflow-hidden w-full aspect-[4/3] max-h-[500px]">
                            
                            {/* Window Header */}
                            <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2 shrink-0">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                                </div>
                                <div className="ml-4 text-xs font-medium text-slate-400 flex items-center gap-1.5">
                                    <SparklesIcon className="size-3.5" /> AI Composer
                                </div>
                            </div>

                            {/* App Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                {/* Platform Selectors */}
                                <div className="flex gap-2 mb-5">
                                    <div className="h-8 px-4 bg-primary-soft text-primary text-xs font-medium rounded-full flex items-center justify-center border border-primary-border">
                                        LinkedIn
                                    </div>
                                    <div className="h-8 px-4 bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 cursor-pointer transition-colors text-xs font-medium rounded-full flex items-center justify-center">
                                        Instagram
                                    </div>
                                    <div className="h-8 px-4 bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 cursor-pointer transition-colors text-xs font-medium rounded-full flex items-center justify-center">
                                        X
                                    </div>
                                </div>

                                {/* Content Generation Area */}
                                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50 flex-1 flex flex-col relative">
                                    <div className="flex items-center gap-2 mb-3 shrink-0">
                                        <SparklesIcon className="size-4 text-primary" />
                                        <div className="text-xs font-semibold text-slate-600">Generated Post</div>
                                    </div>
                                    
                                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                        Exciting news! We're thrilled to announce the launch of SocialFlow. This marks a significant milestone in our journey to streamline social media management for professionals and teams alike. 🚀
                                        <br/><br/>
                                        #Innovation #SocialMedia
                                    </p>
                                    
                                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100">
                                        <div className="text-xs font-medium text-slate-400">Tone: <span className="text-slate-600">Professional</span></div>
                                        <div className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded shadow-sm">Schedule</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Element 1: Status Card */}
                        <div className="absolute -bottom-6 -left-6 bg-white border border-slate-200 rounded-xl p-3 shadow-xl shadow-slate-200/50 flex flex-col gap-2 w-48 animate-pulse-slow">
                            <div className="flex items-center gap-2">
                                <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[10px] font-medium border border-amber-200">
                                    <CalendarClockIcon className="size-3" /> Scheduled
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="h-2 w-24 bg-slate-700 rounded-full" />
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <CheckCircleIcon className="size-3.5 text-emerald-500" />
                                <div className="text-[10px] font-medium text-slate-500">Ready for publishing</div>
                            </div>
                        </div>

                        {/* Floating Element 2: Platform Icons Cluster */}
                        <div className="absolute -top-8 -right-4 bg-white border border-slate-100 rounded-2xl p-2.5 shadow-lg shadow-slate-200/40 flex flex-col gap-2">
                            {PLATFORMS.filter(p => p.id !== 'twitter').slice(0,3).map((platform) => (
                                <div key={platform.id} className="size-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:text-primary transition-colors cursor-pointer">
                                    <platform.icon className="size-4" />
                                </div>
                            ))}
                            {(() => {
                                const twitterPlatform = PLATFORMS.find(p => p.id === 'twitter');
                                if (!twitterPlatform) return null;
                                const TwitterIcon = twitterPlatform.icon;
                                return (
                                    <div className="size-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:text-primary transition-colors cursor-pointer">
                                        <span className="flex items-center justify-center"><TwitterIcon className="size-4" /></span>
                                    </div>
                                );
                            })()}
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
