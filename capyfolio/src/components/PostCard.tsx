import { Heart, MessageSquare, Sparkles } from 'lucide-react';
import type { Post } from '../types';

export function PostCard({
  post,
  currentUserName,
  onToggleLike,
  onAddComment,
}: {
  post: Post;
  currentUserName?: string;
  onToggleLike: () => void;
  onAddComment: (text: string) => void;
}) {
  return (
    <article className="bg-white border border-[#DDE2E6] rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="flex items-start gap-3">
        <img src={post.authorAvatar} alt={post.authorName} className="w-11 h-11 rounded-full object-cover border border-[#DDE2E6]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#182536]">{post.authorName}</p>
              <p className="text-[11px] text-gray-500">{post.authorRole} • {post.authorInstitution}</p>
            </div>
            <span className="text-[10px] text-gray-500 uppercase tracking-[0.12em]">{post.category}</span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-[#182536] whitespace-pre-line">{post.content}</p>

          <div className="mt-4 flex items-center gap-5 text-[11px] text-gray-500">
            <button type="button" onClick={onToggleLike} className={`inline-flex items-center gap-1.5 ${post.likedByMe ? 'text-[#1E3C61]' : 'text-gray-500'} cursor-pointer`}>
              <Heart className={`w-3.5 h-3.5 ${post.likedByMe ? 'fill-[#1E3C61]' : ''}`} /> {post.likes}
            </button>
            <span className="inline-flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> {post.comments.length}</span>
            <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> {post.timestamp}</span>
          </div>

          {post.comments.length > 0 && (
            <div className="mt-4 space-y-2 border-t border-[#F1F3F5] pt-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="rounded-xl bg-[#FAF7F2] border border-[#DDE2E6] px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-[#182536]">{comment.authorName}</span>
                    <span className="text-[10px] text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600 leading-relaxed">{comment.text}</p>
                </div>
              ))}
            </div>
          )}

          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget as HTMLFormElement;
              const input = form.elements.namedItem('comment') as HTMLInputElement | null;
              if (input && input.value.trim()) {
                onAddComment(input.value.trim());
                input.value = '';
              }
            }}
          >
            <input
              name="comment"
              type="text"
              placeholder={currentUserName ? `Responder como ${currentUserName}...` : 'Escreva um comentário...'}
              className="flex-1 bg-[#FAF7F2] border border-[#CBD3DA] rounded-lg px-3 py-2 text-xs text-[#182536] placeholder:text-gray-400 focus:outline-none focus:border-[#1E3C61]"
            />
            <button type="submit" className="px-3 py-2 bg-[#1E3C61] text-white rounded-lg text-xs font-semibold hover:bg-[#162D49] cursor-pointer">Enviar</button>
          </form>
        </div>
      </div>
    </article>
  );
}
