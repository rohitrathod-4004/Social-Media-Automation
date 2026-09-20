import { useEffect, useState } from "react";
import { PLATFORMS } from "../assets/assets";
import { CalendarIcon, ClockIcon, ArrowRightIcon, XIcon, CalendarDaysIcon, SendIcon, PencilIcon, AlertTriangleIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import ScheduleAccountValidationModal from "../components/ScheduleAccountValidationModal";
import { validatePostForPlatforms } from "../utils/platformValidation";

const Scheduler = () => {

  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // for showing the modal to select platforms if no accounts are connected
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showAccountValidationModal, setShowAccountValidationModal] = useState(false);
  const [missingPlatforms, setMissingPlatforms] = useState<string[]>([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  //for editing a scheduled post
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editContent, setEditContent] = useState("");
  const [editPlatforms, setEditPlatforms] = useState<string[]>([]);
  const [editScheduledDate, setEditScheduledDate] = useState("");
  const [editScheduledTime, setEditScheduledTime] = useState("");
  const [editMediaFile, setEditMediaFile] = useState<File | null>(null);
  const [removeEditMedia, setRemoveEditMedia] = useState(false);
  const [editPlatformContent, setEditPlatformContent] = useState<Record<string, string>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [selectedFailedPost, setSelectedFailedPost] = useState<any>(null);

  const fetchAccounts = async () => {
    try {
      const { data } = await api.get("/api/accounts");
      setAccounts(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/api/posts")
      setPosts(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    fetchPosts();
    fetchAccounts();
    const interval = setInterval(async () => await fetchPosts(), 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const postId = searchParams.get("postId");
    if (postId && posts.length > 0) {
      const targetPost = posts.find((p) => p._id === postId);
      if (targetPost && !editingPost && !selectedFailedPost) {
        if (targetPost.status === "failed") {
          setSelectedFailedPost(targetPost);
        } else if (targetPost.status === "draft" || targetPost.status === "scheduled") {
          openEditModal(targetPost);
        } else if (targetPost.status === "published") {
          setTimeout(() => {
            const el = document.getElementById(`post-${targetPost._id}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
        }
        searchParams.delete("postId");
        setSearchParams(searchParams, { replace: true });
      }
    }
  }, [posts, searchParams, setSearchParams, editingPost, selectedFailedPost]);

  const scheduled = posts.filter((p) => p.status === "scheduled")
  const published = posts.filter((p) => p.status === "published")
  const failed = posts.filter((p) => p.status === "failed")
  const drafts = posts.filter((p) => p.status === "draft")

  const formatFailureReason = (reason: unknown) => {
    if (typeof reason === "string") return reason;
    if (reason && typeof reason === "object") {
      return (reason as { message?: string }).message || JSON.stringify(reason);
    }
    return "Publishing failed without a recorded reason.";
  }

  const togglePlatform = (id: string) => setSelectedPlatforms((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validatePostForPlatforms(
      selectedPlatforms,
      accounts,
      {
        file: mediaFile,
      }
    );

    if (!validation.isValid) {

      if (validation.errorType === "media") {
        toast.error(validation.errorMessage ?? "Unable to schedule post.");
        return;
      }

      if (validation.errorType === "platform") {
        toast.error(validation.errorMessage ?? "Unable to schedule post.");
        return;
      }

      setMissingPlatforms(validation.missingPlatforms);
      setShowAccountValidationModal(true);
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      toast.error("Select date and time.")
      return;
    }

    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();

    const formData = new FormData();
    formData.append("content", content);
    formData.append("scheduledFor", scheduledFor);
    formData.append("status", "scheduled");
    formData.append("platforms", JSON.stringify(selectedPlatforms));

    if (mediaFile) {
      formData.append("media", mediaFile);
    }

    setLoading(true);

    try {
      await api.post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post scheduled!");

      setContent("");
      setScheduledDate("");
      setScheduledTime("");
      setSelectedPlatforms([]);
      setMediaFile(null);

      fetchPosts();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  //helper function for scheduled post editing
  const openEditModal = (post: any) => {
    let d = "";
    let t = "";
    if (post.scheduledFor) {
      const scheduledDate = new Date(post.scheduledFor);
      d = scheduledDate.toISOString().slice(0, 10);
      t = scheduledDate.toTimeString().slice(0, 5);
    }

    setEditingPost(post);
    setEditContent(post.content);
    setEditPlatforms(post.platforms);
    setEditPlatformContent(post.platformContent || {});
    setEditScheduledDate(d);
    setEditScheduledTime(t);
    setEditMediaFile(null);
    setRemoveEditMedia(false);
  };

  const handleEditPost = async (finalStatus: "scheduled" | "draft") => {
    if (!editingPost) return;

    let scheduledFor = "";

    if (finalStatus === "scheduled") {
      if (!editScheduledDate || !editScheduledTime) {
        toast.error("Select date and time.");
        return;
      }

      scheduledFor = new Date(
        `${editScheduledDate}T${editScheduledTime}`
      ).toISOString();

      const validation = validatePostForPlatforms(
        editPlatforms,
        accounts,
        {
          file: editMediaFile,
          url: removeEditMedia ? null : editingPost.mediaUrl,
          type: removeEditMedia ? null : editingPost.mediaType,
        }
      );

      if (!validation.isValid) {
        if (
          validation.errorType === "platform" ||
          validation.errorType === "media"
        ) {
          toast.error(
            validation.errorMessage ?? "Unable to update post."
          );
          return;
        }

        setMissingPlatforms(validation.missingPlatforms);
        setShowAccountValidationModal(true);
        return;
      }
    } else {
      if (editScheduledDate && editScheduledTime) {
        scheduledFor = new Date(
          `${editScheduledDate}T${editScheduledTime}`
        ).toISOString();
      }
    }

    const formData = new FormData();

    formData.append("content", editContent);
    formData.append("platforms", JSON.stringify(editPlatforms));
    formData.append("platformContent", JSON.stringify(editPlatformContent));
    if (scheduledFor) {
      formData.append("scheduledFor", scheduledFor);
    }
    formData.append(
      "mediaUrl",
      removeEditMedia ? "" : editingPost.mediaUrl || ""
    );
    formData.append(
      "mediaType",
      removeEditMedia ? "" : editingPost.mediaType || ""
    );
    formData.append("removeMedia", String(removeEditMedia));
    formData.append("status", finalStatus);

    if (editMediaFile) {
      formData.append("media", editMediaFile);
    }

    setEditLoading(true);

    try {
      await api.patch(`/api/posts/${editingPost._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (editingPost.status === "failed" && finalStatus === "scheduled") {
        await api.post(`/api/posts/${editingPost._id}/retry`);
      }

      toast.success(
        finalStatus === "draft"
          ? "Draft updated."
          : editingPost.status === "failed"
            ? "Failed post scheduled for retry."
            : "Scheduled post updated."
      );

      setEditingPost(null);
      setEditMediaFile(null);
      setRemoveEditMedia(false);
      await fetchPosts();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update post."
      );
    } finally {
      setEditLoading(false);
    }
  };


  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Compose panel */}
      <div className="w-full lg:w-[460px] shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg text-slate-700">Compose Post</h2>
          </div>
          <form className="space-y-5" onSubmit={handleSchedule}>
            {/* Platforms */}
            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">Platforms</label>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p) => {
                  const active = selectedPlatforms.includes(p.id);
                  return (
                    <button key={p.id} type="button" className={`flex items-center gap-1.5 p-3 rounded-md border transition-all duration-150 ${active ? "bg-primary-soft border-primary-border text-primary scale-103" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                      onClick={() => togglePlatform(p.id)}>
                      <p.icon className="size-4.5" />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs text-slaye-500 uppercase mb-2">Content</label>
              <textarea required rows={5} placeholder="What do you want to share today?" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder-slate-400 outline-none resize-none"
                value={content} onChange={(e) => setContent(e.target.value)} />
              <div className={`text-right text-xs mt-1 font-medium ${content.length > 270 ? "text-red-500" : "text-slate-500"}`}>
                {content.length}/300
              </div>
            </div>

            {/* Media upload */}
            <div>
              <label className="block text-xs text-slaye-500 uppercase mb-2">Media (optional)</label>
              {mediaFile ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  {mediaFile.type.startsWith("image/") ? <img src={URL.createObjectURL(mediaFile)} alt="preview" className="w-full h-40 object-cover" /> :
                    <video src={URL.createObjectURL(mediaFile)} className="w-full h-40 object-cover" controls />}
                  <button
                    type="button" onClick={() => setMediaFile(null)}
                    className="absolute top-2 right-2 size-7 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full flex items-center justify-center transition-colors">
                    <XIcon className="size-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 p-5 py-10 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary-border hover:bg-primary-soft transition-all group">
                  <span className="text-sm text-slate-500 group-hover:text-primary-hover transition-colors">Click to upload Image or Video</span>
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => e.target.files?.[0] && setMediaFile(e.target.files[0])} />
                </label>
              )}
            </div>

            {/* Date & TIme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 uppercase mb-2">Date</label>
                <div className="relative">
                  <CalendarIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm outline-none" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase mb-2">Time</label>
                <div className="relative">
                  <ClockIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="time"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm outline-none" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white hover:bg-primary-hover rounded-lg transition-all">
              {loading ? (
                <div>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Scheduling...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Schedule Post
                  <ArrowRightIcon className="size-4" />
                </div>
              )}
            </button>
          </form>
        </div>
      </div >

      {/* Queue panels */}
      <div className="flex-1 min-w-0 flex flex-col gap-6 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2 pb-10">
        {/* Drafts */}
        <div className="flex max-h-96 flex-col flex-none overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 shrink-0">
            <PencilIcon className="size-4 text-zinc-500" />
            <h3 className="text-slate-900 text-sm">Drafts</h3>
            <span className="ml-auto text-xs font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full">{drafts.length}</span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto divide-y divide-slate-50 pb-4">
            {drafts.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">No drafts yet</div>
            ) : (
              drafts.map((post) => (
                <div id={`post-${post._id}`} key={post._id} className="px-5 py-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-1.5 items-center">
                      {post.platforms.map((pl: string) => {
                        const meta = PLATFORMS.find((p) => p.id === pl);
                        return meta ? <meta.icon key={pl} className="size-3.5 text-slate-400" /> : null;
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      {post.mediaType && <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-md font-semibold capitalize">{post.mediaType}</span>}
                      <span className="text-xs text-slate-400">Draft</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 max-w-md">{post.content}</p>
                  <button
                    type="button"
                    onClick={() => openEditModal(post)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100"
                  >
                    <PencilIcon className="size-3.5" />
                    Edit Draft
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming */}
        <div className="flex max-h-96 flex-col flex-none overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 shrink-0">
            <CalendarDaysIcon className="size-4 text-zinc-500" />
            <h3 className="text-slate-900 text-sm">Upcoming</h3>
            <span className="ml-auto text-xs font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full">{scheduled.length}</span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto divide-y divide-slate-50 pb-4">
            {scheduled.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">No posts scheduled yet</div>
            ) : (
              scheduled.map((post) => (
                <div id={`post-${post._id}`} key={post._id} className="px-5 py-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-1.5 items-center">
                      {post.platforms.map((pl: string) => {
                        const meta = PLATFORMS.find((p) => p.id === pl);
                        return meta ? <meta.icon key={pl} className="size-3.5 text-slate-400" /> : null;
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      {post.mediaType && <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-md font-semibold capitalize">{post.mediaType}</span>}
                      <span className="text-xs text-slate-400">{new Date(post.scheduledFor).toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 max-w-md">{post.content}</p>
                  <button
                    type="button"
                    onClick={() => openEditModal(post)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-primary-border bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:border-primary hover:bg-white"
                  >
                    <PencilIcon className="size-3.5" />
                    Edit post
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Failed */}
        <div className="flex max-h-96 flex-col flex-none overflow-hidden rounded-2xl border border-red-200 bg-red-50/30">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-red-100 shrink-0">
            <AlertTriangleIcon className="size-4 text-red-500" />
            <h3 className="text-slate-900 text-sm">Failed</h3>
            <span className="ml-auto text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{failed.length}</span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-red-100">
            {failed.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">No failed posts</div>
            ) : (
              failed.map((post) => (
                <div
                  id={`post-${post._id}`}
                  key={post._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedFailedPost(post)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      setSelectedFailedPost(post);
                    }
                  }}
                  className="flex cursor-pointer items-center gap-3 px-5 py-3 transition-colors hover:bg-red-100/60 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-300"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                    <AlertTriangleIcon className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-700">{post.content}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span>{post.platforms.join(", ")}</span>
                      <span aria-hidden="true">•</span>
                      <span>{post.failedAt ? new Date(post.failedAt).toLocaleString() : "Failure time unavailable"}</span>
                    </div>
                  </div>

                  <span className="shrink-0 text-xs font-medium text-red-600">View</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Published */}
        <div className="flex max-h-96 flex-col flex-none overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 shrink-0">
            <SendIcon className="size-4 text-zinc-500" />
            <h3 className="text-slate-900 text-sm">Published</h3>
            <span className="ml-auto text-xs font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full">{published.length}</span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-50">
            {published.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">No posts published yet</div>
            ) : (
              published.map((post) => (
                <div id={`post-${post._id}`} key={post._id} className="px-5 py-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-1.5 items-center">
                      {post.platforms.map((pl: string) => {
                        const meta = PLATFORMS.find((p) => p.id === pl);
                        return meta ? <meta.icon key={pl} className="size-3.5 text-slate-400" /> : null;
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      {post.mediaType && <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-md font-semibold capitalize">{post.mediaType}</span>}
                      <span className="text-xs text-slate-400">{new Date(post.updatedAt).toLocaleString()}</span>
                      <span className="text-sm bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">Published</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 max-w-md">{post.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedFailedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-red-100 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <AlertTriangleIcon className="size-5 text-red-500" />
                <h3 className="text-lg text-slate-900">Failed post</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFailedPost(null)}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100"
                aria-label="Close failed post details"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Content</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {selectedFailedPost.content}
                </p>
              </div>

              {selectedFailedPost.mediaUrl && (
                selectedFailedPost.mediaType === "video" ? (
                  <video
                    src={selectedFailedPost.mediaUrl}
                    controls
                    className="max-h-72 w-full rounded-xl object-contain"
                  />
                ) : (
                  <img
                    src={selectedFailedPost.mediaUrl}
                    alt="Failed post media"
                    className="max-h-72 w-full rounded-xl object-contain"
                  />
                )
              )}

              <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Platforms</p>
                  <p className="mt-1 text-slate-700">{selectedFailedPost.platforms.join(", ")}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Scheduled for</p>
                  <p className="mt-1 text-slate-700">
                    {selectedFailedPost.scheduledFor
                      ? new Date(selectedFailedPost.scheduledFor).toLocaleString()
                      : "Not set"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-red-600">Failure reason</p>
                <p className="mt-2 break-words text-sm leading-relaxed text-slate-700">
                  {formatFailureReason(selectedFailedPost.failureReason)}
                </p>
                {selectedFailedPost.failedAt && (
                  <p className="mt-2 text-xs text-slate-400">
                    Failed: {new Date(selectedFailedPost.failedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  openEditModal(selectedFailedPost);
                  setSelectedFailedPost(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
              >
                <PencilIcon className="size-4" />
                Edit & Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg text-slate-900">
                Edit Scheduled Post
              </h3>

              <button
                type="button"
                onClick={() => {
                  setEditingPost(null);
                  setEditMediaFile(null);
                  setRemoveEditMedia(false);
                }}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            {Object.keys(editPlatformContent).length > 0 ? (
              <div className="space-y-4 mb-4">
                {editPlatforms.map((platformId) => {
                  const meta = PLATFORMS.find((p) => p.id === platformId);
                  return (
                    <div key={platformId} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                      <div className="bg-slate-100/50 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
                        {meta && <meta.icon className="size-4 text-slate-500" />}
                        <span className="text-xs font-medium text-slate-600 capitalize">{meta ? meta.name : platformId}</span>
                      </div>
                      <textarea
                        className="w-full px-5 py-4 bg-transparent text-sm resize-y min-h-[100px] outline-none"
                        value={editPlatformContent[platformId] || ""}
                        onChange={(event) =>
                          setEditPlatformContent((prev) => ({
                            ...prev,
                            [platformId]: event.target.value,
                          }))
                        }
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <textarea
                rows={5}
                value={editContent}
                onChange={(event) => setEditContent(event.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none mb-4"
              />
            )}

            <div className="mt-5">
              <label className="block text-xs text-slate-500 uppercase mb-2">
                Platforms
              </label>

              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((platform) => {
                  const active = editPlatforms.includes(platform.id);

                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() =>
                        setEditPlatforms((previous) =>
                          previous.includes(platform.id)
                            ? previous.filter((id) => id !== platform.id)
                            : [...previous, platform.id]
                        )
                      }
                      className={`p-2.5 rounded-md border ${active
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-slate-400 border-slate-200"
                        }`}
                    >
                      <platform.icon className="size-4.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              <input
                type="date"
                value={editScheduledDate}
                onChange={(event) => setEditScheduledDate(event.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg"
              />

              <input
                type="time"
                value={editScheduledTime}
                onChange={(event) => setEditScheduledTime(event.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="mt-5">
              {editMediaFile ? (
                <div>
                  {editMediaFile.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(editMediaFile)}
                      alt="New media preview"
                      className="w-full h-40 object-cover rounded-xl"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(editMediaFile)}
                      controls
                      className="w-full h-40 object-cover rounded-xl"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => setEditMediaFile(null)}
                    className="mt-2 text-sm text-red-500"
                  >
                    Remove selected media
                  </button>
                </div>
              ) : editingPost.mediaUrl && !removeEditMedia ? (
                <div>
                  {editingPost.mediaType === "image" ? (
                    <img
                      src={editingPost.mediaUrl}
                      alt="Current media"
                      className="w-full h-40 object-cover rounded-xl"
                    />
                  ) : (
                    <video
                      src={editingPost.mediaUrl}
                      controls
                      className="w-full h-40 object-cover rounded-xl"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => setRemoveEditMedia(true)}
                    className="mt-2 text-sm text-red-500"
                  >
                    Remove current media
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer">
                  <span className="text-sm text-slate-500">
                    Add or replace media
                  </span>

                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (file) {
                        setEditMediaFile(file);
                        setRemoveEditMedia(false);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {editingPost?.status === "draft" && (
                <button
                  type="button"
                  onClick={() => handleEditPost("draft")}
                  disabled={editLoading}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-700 hover:bg-slate-50"
                >
                  {editLoading ? "Saving..." : "Save Draft"}
                </button>
              )}
              <button
                type="button"
                onClick={() => handleEditPost("scheduled")}
                disabled={editLoading}
                className={`${editingPost?.status === "draft" ? "w-full" : "w-full col-span-2"} rounded-lg bg-primary hover:bg-primary-hover px-4 py-3 text-white transition-colors`}
              >
                {editLoading ? "Saving..." : editingPost?.status === "draft" ? "Schedule Post" : "Save Changes"}
              </button>
            </div>
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

    </div >

  );
}

export default Scheduler
