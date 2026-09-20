import { CalendarClockIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon, Edit3Icon } from "lucide-react";

export default function ShowcaseScheduler() {
    return (
        <section id="scheduler" className="py-24 bg-slate-50 border-b border-slate-100 overflow-hidden">
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left: UI Showcase */}
                    <div className="relative order-2 lg:order-1">
                        {/* Decorative background blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.06)_0%,transparent_70%)] -z-10" />
                        
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-4">
                            
                            {/* Mock Draft Post */}
                            <div className="border border-slate-100 rounded-xl p-4 shadow-sm bg-white flex items-center justify-between">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-24 bg-slate-200 rounded-full" />
                                        <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200">
                                            <Edit3Icon className="size-3" /> Draft
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-48 bg-slate-100 rounded-full" />
                                </div>
                                <div className="size-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                    <div className="size-4 text-slate-300" />
                                </div>
                            </div>

                            {/* Mock Scheduled Post */}
                            <div className="border border-primary-border/50 rounded-xl p-4 shadow-sm bg-primary-soft/30 flex items-center justify-between relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                                <div className="flex flex-col gap-1.5 pl-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-32 bg-slate-700 rounded-full" />
                                        <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[10px] font-medium border border-amber-200">
                                            <ClockIcon className="size-3" /> Scheduled
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <CalendarClockIcon className="size-3.5 text-slate-400" />
                                        <div className="text-[11px] font-medium text-slate-500">Tomorrow at 9:00 AM</div>
                                    </div>
                                </div>
                            </div>

                            {/* Mock Published Post */}
                            <div className="border border-slate-100 rounded-xl p-4 shadow-sm bg-white flex items-center justify-between">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-28 bg-slate-300 rounded-full" />
                                        <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-medium border border-emerald-200">
                                            <CheckCircleIcon className="size-3" /> Published
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="h-1.5 w-16 bg-slate-100 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Mock Failed Post */}
                            <div className="border border-error-border rounded-xl p-4 shadow-sm bg-error-bg flex items-center justify-between relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-error-text" />
                                <div className="flex flex-col gap-1.5 pl-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-32 bg-slate-700 rounded-full" />
                                        <div className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-medium border border-red-200">
                                            <AlertCircleIcon className="size-3" /> Failed
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-medium text-error-text/80 mt-0.5">Account disconnected. Please reconnect.</div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right: Copy */}
                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 bg-primary-soft border border-primary-border text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                            <CalendarClockIcon className="size-4" />
                            Automation & Scheduling
                        </div>
                        <h2 className="font-sans font-semibold text-4xl sm:text-5xl tracking-tight text-slate-900 mb-6">
                            Set it. Forget it. <br/>
                            <span className="text-slate-900">Never miss a post.</span>
                        </h2>
                        <p className="text-lg text-slate-500 leading-relaxed mb-8">
                            Visually manage your content pipeline. Move seamlessly from Draft to Scheduled, and rely on automatic failure recovery if a platform acts up.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
                                <p className="text-slate-600">Plan your entire week or month in advance.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
                                <p className="text-slate-600">Clear status indicators show exactly where your content stands.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-1 size-1.5 rounded-full bg-error-text shrink-0" />
                                <p className="text-slate-600">Get notified immediately if a post fails to publish, and easily retry.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
