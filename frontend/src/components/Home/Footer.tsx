import { Link } from "react-router-dom";
import { APP_NAME } from "../../assets/assets";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 py-12">
            <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <img src="/logo.svg" alt="logo" className="size-6 opacity-80" />
                    <span className="text-lg font-semibold font-sans text-slate-800 tracking-tight">{APP_NAME}</span>
                </div>
                
                <div className="text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
                    <Link to="/#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link to="/#" className="hover:text-primary transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
