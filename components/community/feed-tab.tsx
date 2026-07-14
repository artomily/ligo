"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ImagePlus, MessageCircle, Send } from "lucide-react";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFeed, type FeedPost } from "@/lib/data/hooks";
import { useLigoStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { timeAgo } from "@/lib/format";
import { formatCompactNumber } from "@/lib/format";

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

function Composer({ communitySlug }: { communitySlug: string }) {
  const { address } = useAccount();
  const displayName = useLigoStore((s) => s.displayName);
  const addPost = useLigoStore((s) => s.addPost);
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  const stockImages = [
    "/products/jersey-blue.svg",
    "/products/scarf-red.svg",
    "/products/sticker-yellow.svg",
  ];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    addPost({
      id: `up-${Date.now()}`,
      communitySlug,
      authorName: displayName || "you",
      authorAddress: address ?? "0x000000000000000000000000000000000000dEaD",
      body: body.trim(),
      imageUrl,
      createdAt: new Date().toISOString(),
      seedLikes: 0,
      seedComments: [],
    });
    setBody("");
    setImageUrl(undefined);
    toast.success("Posted to the community");
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-border bg-card p-4"
    >
      <div className="flex gap-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
            {initials(displayName || "you")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share something with the community…"
            aria-label="Write a post"
            rows={2}
            className="resize-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
          {imageUrl && (
            <div className="relative mt-2 h-28 w-28 overflow-hidden rounded-lg border border-border">
              <Image src={imageUrl} alt="Attached" fill sizes="112px" className="object-cover" />
            </div>
          )}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {stockImages.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() =>
                    setImageUrl((cur) => (cur === img ? undefined : img))
                  }
                  aria-label="Attach image"
                  aria-pressed={imageUrl === img}
                  className={cn(
                    "relative size-8 overflow-hidden rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    imageUrl === img ? "border-primary" : "border-border"
                  )}
                >
                  <Image src={img} alt="" fill sizes="32px" className="object-cover" />
                </button>
              ))}
              <ImagePlus
                className="ml-1 size-4 text-muted-foreground"
                aria-hidden
              />
            </div>
            <Button type="submit" size="sm" disabled={!body.trim()}>
              <Send className="size-3.5" aria-hidden />
              Post
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function PostCard({ post }: { post: FeedPost }) {
  const toggleLike = useLigoStore((s) => s.toggleLike);
  const addComment = useLigoStore((s) => s.addComment);
  const displayName = useLigoStore((s) => s.displayName);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");

  function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment(post.id, {
      id: `uc-${Date.now()}`,
      authorName: displayName || "you",
      body: comment.trim(),
      createdAt: new Date().toISOString(),
    });
    setComment("");
    setShowComments(true);
  }

  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {initials(post.authorName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{post.authorName}</p>
          <p className="text-xs text-muted-foreground">
            {timeAgo(post.createdAt)}
          </p>
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{post.body}</p>

      {post.imageUrl && (
        <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-lg border border-border bg-muted">
          <Image
            src={post.imageUrl}
            alt="Post attachment"
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-3 flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          aria-pressed={post.liked}
          aria-label={post.liked ? "Unlike" : "Like"}
          onClick={() => toggleLike(post.id)}
          className={cn(post.liked && "text-primary")}
        >
          <Heart
            className={cn("size-4", post.liked && "fill-current")}
            aria-hidden
          />
          <span className="font-mono tabular-nums">
            {formatCompactNumber(post.likeCount)}
          </span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments((v) => !v)}
          aria-expanded={showComments}
        >
          <MessageCircle className="size-4" aria-hidden />
          <span className="font-mono tabular-nums">
            {post.comments.length}
          </span>
        </Button>
      </div>

      {showComments && (
        <div className="mt-3 space-y-3 border-t border-border pt-3">
          {post.comments.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No comments yet — be the first.
            </p>
          ) : (
            post.comments.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <Avatar className="size-7">
                  <AvatarFallback className="bg-muted text-[10px] font-semibold">
                    {initials(c.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg bg-muted px-3 py-2">
                  <p className="text-xs font-medium">{c.authorName}</p>
                  <p className="text-sm leading-5">{c.body}</p>
                </div>
              </div>
            ))
          )}
          <form onSubmit={submitComment} className="flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment…"
              aria-label="Add a comment"
              className="h-9 flex-1 rounded-md border border-border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit" size="sm" disabled={!comment.trim()}>
              Send
            </Button>
          </form>
        </div>
      )}
    </article>
  );
}

export function FeedTab({ communitySlug }: { communitySlug: string }) {
  const mounted = useMounted();
  const feed = useFeed(communitySlug);

  return (
    <div className="space-y-4">
      {mounted && <Composer communitySlug={communitySlug} />}
      {feed.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
