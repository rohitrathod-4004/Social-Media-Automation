import { useEffect, useState } from "react";
import { ArrowRightIcon, CalendarIcon, ClockIcon, HistoryIcon, Loader2Icon, TimerIcon, Wand2Icon, XIcon } from "lucide-react";
import api from "../api/axios";
import { PLATFORMS } from "../assets/assets";
import { toast } from "react-hot-toast";
import ScheduleAccountValidationModal from "../components/ScheduleAccountValidationModal";
import { validatePostForPlatforms } from "../utils/platformValidation";
import { useNavigate } from "react-router-dom";


const AIComposer = () => {

  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [generateImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generations, setGenerations] = useState<any[]>([]);

  // Scheduling state
  const [activeScheduler, setActiveScheduler] = useState<any>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const [editedContent, setEditedContent] = useState("");
  const [editedPlatformContent, setEditedPlatformContent] = useState<Record<string, string>>({});



  //until image generation is fixed, we will disable it and show a toast
  const [showImageUnavailable, setShowImageUnavailable] = useState(false);

  //for adding the account validation modal if no accounts are connected
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showAccountValidationModal, setShowAccountValidationModal] = useState(false);
  const [missingPlatforms, setMissingPlatforms] = useState<string[]>([]);
  const navigate = useNavigate();

  const tones = ["Professional", "Creative", "Funny", "Minimalist", "Excited"]

  const fetchAccounts = async () => {
    try {
      const { data } = await api.get("/api/accounts");
      setAccounts(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  const fetchGenerations = async () => {
    try {
      const { data } = await api.get("api/posts/generations")
      setGenerations(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  }

  useEffect(() => {
    toast("Note: Image generation may be temporarily unavailable due to API usage limits.", {
      id: "image-generation-notice",
    });
  }, [])

  useEffect(() => {
    fetchGenerations();
    fetchAccounts();
  }, [])

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error("Please enter a prompt")
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/api/posts/generate", { prompt, tone, generateImage, platforms: selectedPlatforms });
      setGenerations([data, ...generations]);
      setActiveScheduler(data)
      setEditedContent(data.content || "");
      setEditedPlatformContent(data.platformContent || {});
      toast.success("Content generated!")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false)
    }
  }

  const handleSchedule = async () => {

    if (!activeScheduler) return;


    const validation = validatePostForPlatforms(
      selectedPlatforms,
      accounts,
      {
        file: mediaFile,
        url: activeScheduler.mediaUrl,
        type: activeScheduler.mediaType,
      }
    );

    if (!validation.isValid) {
      if (
        validation.errorType === "platform" ||
        validation.errorType === "media"
      ) {
        toast.error(validation.errorMessage ?? "Unable to schedule post.");
        return;
      }

      setMissingPlatforms(validation.missingPlatforms);
      setShowAccountValidationModal(true);
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      toast.error("Select date and time");
      return;
    }

    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    setScheduling(true);
    try {
      if (mediaFile) {
        const formData = new FormData();

        formData.append("content", editedContent);
        formData.append("scheduledFor", scheduledFor);
        formData.append("status", "scheduled");
        formData.append("platforms", JSON.stringify(selectedPlatforms));
        formData.append("platformContent", JSON.stringify(editedPlatformContent));
        formData.append("generation", activeScheduler._id);
        formData.append("media", mediaFile);

        await api.post("/api/posts", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/api/posts", {
          content: editedContent,
          platformContent: editedPlatformContent,
          mediaUrl: activeScheduler.mediaUrl,
          mediaType: activeScheduler.mediaType,
          platforms: selectedPlatforms,
          scheduledFor,
          status: "scheduled",
          generation: activeScheduler._id,
        });
      }

      toast.success("AI Post scheduled!");

      await fetchGenerations();

      setActiveScheduler(null);
      setSelectedPlatforms([]);
      setScheduledDate("");
      setScheduledTime("");
      setMediaFile(null);

    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setScheduling(false);
    }
  }

  const handleSaveDraft = async () => {
    if (!activeScheduler) return;

    setScheduling(true);
    try {
      if (mediaFile) {
        const formData = new FormData();
        formData.append("content", editedContent);
        formData.append("status", "draft");
        formData.append("platforms", JSON.stringify(selectedPlatforms));
        formData.append("platformContent", JSON.stringify(editedPlatformContent));
        formData.append("generation", activeScheduler._id);
        formData.append("media", mediaFile);

        await api.post("/api/posts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/api/posts", {
          content: editedContent,
          platformContent: editedPlatformContent,
          mediaUrl: activeScheduler.mediaUrl,
          mediaType: activeScheduler.mediaType,
          platforms: selectedPlatforms,
          status: "draft",
          generation: activeScheduler._id,
        });
      }

      toast.success("Saved as draft!");
      await fetchGenerations();

      setActiveScheduler(null);
      setSelectedPlatforms([]);
      setScheduledDate("");
      setScheduledTime("");
      setMediaFile(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save draft.");
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div>
      {/* Input Section */}
      <div className="space-y-6 text-center mt-20">
        <h1 className="text-3xl text-slate-700 tracking-tight">What should we create today?</h1>
        <div className="relative group mt-12">
          <textarea className="w-full px-6 py-6 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 transition resize-none h-40" placeholder="Share your idea... (e.g. A post about the launch of our new eco-friendly coffee beans)" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <div className="absolute bottom-4 right-2.5 flex items-center gap-3 text-sm">
            {/* <button onClick={() => setGenerateImage(!generateImage)} className="flex items-center gap-3 bg-red-50 py-2 px-3 rounded-lg"> */}
            <button onClick={() => setShowImageUnavailable(true)} className="flex items-center gap-3 bg-primary-soft text-primary py-2 px-3 rounded-lg">
              <span>AI Image</span>
              <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${generateImage ? "bg-primary" : "bg-slate-200"}`}>
                <span className={`pointer-events-none size-4 transform translate-y-0.5 rounded-full bg-white transition ${generateImage ? "translate-x-4.5" : "translate-x-0.5"}`} />
              </div>
            </button>

            <button onClick={handleGenerate} className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 px-4 py-2 rounded-lg">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2Icon className="size-4 animate-spin" />
                  <span>Generating</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 px-1.5">
                  Generate
                  <ArrowRightIcon className="size-4" />
                </div>
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <div className="flex flex-wrap gap-2 items-center justify-center border-r border-slate-200 pr-4">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold mr-2">Tone</span>
            {tones.map((t) => (
              <button key={t} onClick={() => setTone(t)} className={`px-4 py-1.5 rounded-full text-sm transition-all border ${tone === t ? "bg-primary border-primary text-white" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold mr-2">Platforms</span>
            {PLATFORMS.map((p) => {
              const active = selectedPlatforms.includes(p.id)
              return (
                <button key={p.id} onClick={() => setSelectedPlatforms((prev) => (prev.includes(p.id) ? prev.filter((x) => x != p.id) : [...prev, p.id]))}
                  className={`p-2 rounded-full border transition-all ${active ? "bg-primary border-primary text-white" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"}`}>
                  <p.icon className="size-4" />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* AI Generated Posts */}
      <div className="space-y-6 pt-12 border-t border-slate-100">
        <div className="flex items-center justify-between text-slate-600">
          <div className="flex items-center gap-2">
            <HistoryIcon className="size-5" />
            <h2 className="text-xl">Recent Generations</h2>
          </div>
          <span className="text-sm text-slate-500 bg-slate-50 px-2">{generations.length} total</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {generations.map((gen) => (
            <div key={gen._id} className="group bg-white rounded-2xl border border-slate-100 p-5 hover:border-slate-200 transition-all relative overflow-hidden">
              <div className="flex flex-col h-full space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 uppercase tracking-widest">{new Date(gen.createdAt).toLocaleString()}</span>
                  <span className="text-xs text-primary bg-primary-soft px-2 py-0.5 rounded-md">{gen.tone}</span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed flex-1">{gen.content}</p>

                {gen.mediaUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-50 bg-slate-50">
                    <img src={gen.mediaUrl} alt="Gen" className="w-full aspect-video object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2">
                  {gen.postStatus === null ? (
                    <button
                      onClick={() => {
                        setMediaFile(null);
                        setActiveScheduler(gen);
                        setEditedContent(gen.content || "");
                        setEditedPlatformContent(gen.platformContent || {});
                      }}
                      className="flex-1 bg-slate-100 hover:bg-primary hover:text-white text-slate-600 text-xs py-2.5 rounded-lg transition-all">
                      Create Post
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/scheduler?postId=${gen.postId}`)}
                      className="flex-1 text-center bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 text-xs py-2.5 rounded-lg transition-all">
                      {gen.postStatus === "draft" ? "Open Draft" :
                        gen.postStatus === "scheduled" ? "View Scheduled" :
                          gen.postStatus === "failed" ? "View Failed" :
                            "View Published"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {
            generations.length === 0 && (
              <div className="col-span-full py-20 text-center space-y-2">
                <div className="size-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                  <Wand2Icon className="size-6" />
                </div>
                <p className="text-slate-400 text-sm">No content generated yet. Try generating some content using the AI.</p>
              </div>
            )
          }
        </div>
      </div>

      {showImageUnavailable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-slate-100 p-6">
            <h3 className="text-lg text-slate-900">AI image generation unavailable</h3>

            <p className="mt-3 text-sm text-slate-600">
              AI image generation is currently unavailable. You can upload an image
              from your device instead.
            </p>

            <button
              onClick={() => setShowImageUnavailable(false)}
              className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {showAccountValidationModal && (
        <ScheduleAccountValidationModal
          missingPlatforms={missingPlatforms}
          onClose={() => setShowAccountValidationModal(false)}
          onGoToAccounts={() => navigate("/accounts")}
        />
      )}

      {activeScheduler && (
        <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">

            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/30">
              <h3 className="text-slate-900 font-medium">Schedule Generation</h3>
              <button onClick={() => {
                setMediaFile(null);
                setActiveScheduler(null);
              }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                <XIcon className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                {Object.keys(editedPlatformContent).length > 0 ? (
                  <div className="space-y-3">
                    {selectedPlatforms.map((platformId) => {
                      const meta = PLATFORMS.find((p) => p.id === platformId);
                      return (
                        <div key={platformId} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                          <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center gap-2">
                            {meta && <meta.icon className="size-4 text-slate-500" />}
                            <span className="text-xs font-medium text-slate-600 capitalize">{meta ? meta.name : platformId}</span>
                          </div>
                          <textarea
                            className="w-full px-3 py-2 text-sm text-slate-700 bg-transparent outline-none resize-y min-h-[80px]"
                            value={editedPlatformContent[platformId] || ""}
                            onChange={(e) =>
                              setEditedPlatformContent((prev) => ({
                                ...prev,
                                [platformId]: e.target.value,
                              }))
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <textarea
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none resize-y min-h-[100px]"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                )}

                {activeScheduler.mediaUrl ? (
                  <img
                    src={activeScheduler.mediaUrl}
                    alt="Generated preview"
                    className="w-full h-40 object-cover rounded-xl border border-slate-200 shadow-sm"
                  />
                ) : mediaFile ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white group">
                    <img
                      src={URL.createObjectURL(mediaFile)}
                      alt="Uploaded preview"
                      className="w-full h-40 object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => setMediaFile(null)}
                      className="absolute top-2 right-2 size-6 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XIcon className="size-3.5" />
                    </button>

                    <label className="block text-center py-1.5 text-xs text-primary cursor-pointer hover:bg-white/90 bg-white/80 absolute bottom-0 inset-x-0 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Replace image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];

                          if (file) {
                            setMediaFile(file);
                          }

                          event.currentTarget.value = "";
                        }}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex items-center justify-center h-24 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary-border hover:bg-primary-soft transition-all bg-white">
                    <span className="text-xs font-medium text-slate-500">
                      Add Image
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                          setMediaFile(file);
                        }

                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="p-5 bg-slate-50/50 border-t border-slate-50 space-y-5">
              {/* Options */}
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <CalendarIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>

                  <div className="relative">
                    <ClockIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="time"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={scheduling}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition text-sm font-medium">
                  {scheduling ? <Loader2Icon className="size-4 animate-spin" /> : "Save Draft"}
                </button>
                <button
                  type="button"
                  onClick={handleSchedule}
                  disabled={scheduling}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-slate-200 text-slate-700 hover:bg-primary hover:text-white transition text-sm font-medium">
                  {scheduling ? <Loader2Icon className="size-4 animate-spin" /> : <TimerIcon className="size-4" />}
                  Schedule Post
                </button>
              </div>
            </div>

          </div>
        </div>
      )}


    </div>
  )
}

export default AIComposer