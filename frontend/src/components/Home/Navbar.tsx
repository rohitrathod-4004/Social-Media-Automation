import { Link } from "react-router-dom";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import { useAuth } from "../../context/Authcontext";
import { APP_NAME } from "../../assets/assets";
import { Button } from "../ui/Button";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Link to="/" onClick={() => scrollTo(0, 0)} className="flex items-center gap-2 ">
                    <div className="size-7 bg-primary rounded-lg flex items-center justify-center">
                        <SparklesIcon className="size-4 text-white" />
                    </div>
                    <span className="text-xl lg:text-2xl font-semibold font-sans text-slate-800 tracking-tight">{APP_NAME}</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm text-slate-500 font-medium">
                    <a href="#how-it-works" className="hover:text-primary transition-colors">
                        Workflow
                    </a>
                    <a href="#ai-composer" className="hover:text-primary transition-colors">
                        AI Composer
                    </a>
                    <a href="#scheduler" className="hover:text-primary transition-colors">
                        Scheduler
                    </a>
                </div>

                {user ? (
                    <Link to="/dashboard">
                        <Button size="sm" variant="primary" className="flex items-center gap-1.5 shadow-sm rounded-full">
                            Go to Dashboard <ArrowRightIcon className="size-3.5" />
                        </Button>
                    </Link>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block">
                            Sign In
                        </Link>
                        <Link to="/login">
                            <Button size="sm" variant="primary" className="flex items-center gap-1.5 shadow-sm rounded-full">
                                Get Started <ArrowRightIcon className="size-3.5" />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
