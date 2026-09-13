import { XIcon } from "lucide-react";

interface ScheduleAccountValidationModalProps {
  missingPlatforms: string[];
  onClose: () => void;
  onGoToAccounts: () => void;
}

const ScheduleAccountValidationModal = ({
  missingPlatforms,
  onClose,
  onGoToAccounts,
}: ScheduleAccountValidationModalProps) => {
  const message =
    missingPlatforms.length === 1
      ? `${missingPlatforms[0]} is not connected.`
      : `${missingPlatforms.join(", ")} are not connected.`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg text-slate-900">Connect an account first</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-600">
          You need to connect a social account before scheduling this post.
        </p>

        <p className="mt-2 text-sm text-red-600">{message}</p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600"
          >
            Close
          </button>

          <button
            onClick={onGoToAccounts}
            className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
          >
            Connect account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAccountValidationModal;