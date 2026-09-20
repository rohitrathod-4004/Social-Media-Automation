import { PenLineIcon, SparklesIcon, CalendarClockIcon, SendIcon } from "lucide-react";

const steps = [
    { id: "create", title: "Create", icon: PenLineIcon, description: "Start with a single idea or prompt." },
    { id: "customize", title: "Customize", icon: SparklesIcon, description: "AI tailors it for each platform." },
    { id: "schedule", title: "Schedule", icon: CalendarClockIcon, description: "Pick the perfect time to post." },
    { id: "publish", title: "Publish", icon: SendIcon, description: "We handle the delivery automatically." },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-slate-50 border-b border-slate-100 overflow-hidden">
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
                <div className="text-center mb-20">
                    <h2 className="font-sans font-semibold text-4xl sm:text-5xl tracking-tight text-slate-900 mb-4">
                        From idea to published post
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        A streamlined workflow designed to save you hours every week.
                    </p>
                </div>

                {/* Workflow Diagram */}
                <div className="relative max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-y-12 md:gap-y-0 relative">
                        {/* Desktop Connectors */}
                        <div className="hidden md:block absolute top-[28px] left-[12.5%] right-[12.5%] h-0.5 bg-slate-200" />
                        
                        {steps.map((step, index) => (
                            <div key={step.id} className="relative flex flex-col items-center text-center">
                                {/* Mobile vertical connector */}
                                {index !== steps.length - 1 && (
                                    <div className="md:hidden absolute top-[56px] bottom-[-48px] w-0.5 bg-slate-200" />
                                )}
                                
                                <div className="relative z-10 size-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-primary mb-6 transition-transform hover:scale-110 hover:border-primary-border hover:shadow-primary-soft">
                                    <step.icon className="size-6" />
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-sm text-slate-500 px-4">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
