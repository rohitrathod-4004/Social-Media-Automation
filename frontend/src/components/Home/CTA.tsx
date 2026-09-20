import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/Button";

export default function CTA() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-5 sm:px-8">
                <div className="relative rounded-3xl overflow-hidden p-12 sm:p-20 text-center bg-slate-900 shadow-2xl border border-slate-800">
                    
                    {/* Subtle glows */}
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)" }} />
                    <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)" }} />

                    <div className="relative z-10">
                        <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl tracking-tight font-semibold text-white mb-6">
                            Ready to put your social media on <span className="text-primary-soft">autopilot?</span>
                        </h2>
                        
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/login" className="w-full sm:w-auto">
                                <Button variant="primary" size="lg" className="w-full rounded-full shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-[15px] px-10">
                                    Get Started Free <ArrowRightIcon className="size-4" />
                                </Button>
                            </Link>
                        </div>

                        <p className="mt-6 text-sm text-slate-400">No credit card required · Free forever plan available</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
