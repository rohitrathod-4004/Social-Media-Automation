import { PLATFORMS } from "../assets/assets";
import { PlusIcon , AlertCircleIcon, CheckCircleIcon, UnplugIcon } from "lucide-react";

interface AccountListProps {
    accounts : any[],
    onDisconnect : (accountId: string) => void
}

const AccountList = ({accounts , onDisconnect}:AccountListProps) => {

    const handleDisconnect = async (accountId: string) => {
        const confirm = window.confirm("Are you sure you want to disconnect this account?");
        if (!confirm) return;
        await onDisconnect(accountId)
    }

    if(accounts.length === 0){
        return (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center py-20 px-6">
                <div className="size-14 bg-indigo-50 text-primary rounded-2xl flex items-center justify-center mb-4 border border-indigo-100">
                    <PlusIcon className="size-6" />
                </div>
                <p className="text-slate-700 text-lg">No accounts connected</p>
                <p className="text-sm text-center text-slate-400 mt-1 max-w-xs">Connect your social platform to start scheduling and automating your content.</p>
            </div>
        )
    }



  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {
            accounts.map((account , index)=>{
                const meta = PLATFORMS.find((p) => p.id === account.platform);
                if (!meta) return null;

                return (
                    <div key={index} className="group bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-300 transition-all">
                        <div className="size-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                            <meta.icon className="size-6 text-slate-500"/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-slate-900 truncate font-medium text-sm sm:text-base">{account.handle}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{meta.name}</div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            {account.status === "connected"? (
                                <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                    <CheckCircleIcon className="size-3.5 text-emerald-500"/>
                                    <span className="text-xs font-medium text-emerald-700">Connected</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                                    <AlertCircleIcon className="size-3.5 text-amber-500"/>
                                    <span className="text-xs font-medium text-amber-700">Disconnected</span>
                                </div>
                            )}
                        </div>
                        <button
                        onClick={()=>handleDisconnect(account._id)}
                        title="Disconnect account" 
                        className="ml-2 p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all shrink-0">
                            <UnplugIcon className="size-4"/>
                        </button>
                  
                    </div>
                )
            })

        }

    </div>
  )
}

export default AccountList