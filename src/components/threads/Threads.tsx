import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThreadComment } from '@/types/thread';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

interface ThreadsProps {
  threadId: string;
  comments: ThreadComment[];
  onAddComment: (content: string, parentId?: string) => void;
}

const Threads: React.FC<ThreadsProps> = ({ threadId, comments, onAddComment }) => {
  const { t } = useTranslation();
  const { profile } = useNostrAuth();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error(t('threads.Please enter a comment'));
      return;
    }
    onAddComment(newComment, parentId);
    setNewComment('');
    setReplyingTo(null);
  };

  const renderComment = (comment: ThreadComment, level = 0) => {
    const isReplying = replyingTo === comment.id;
    const marginLeft = level * 2;

    return (
      <div key={comment.id} className="mb-4" style={{ marginLeft: `${marginLeft}rem` }}>
        <div className="flex items-start gap-3">
          <img
            src={comment.author.profileImage}
            alt={comment.author.displayName}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.author.displayName}</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="mt-1 text-sm">{comment.content}</p>
            {profile && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-xs"
                onClick={() => setReplyingTo(isReplying ? null : comment.id)}
              >
                {t('threads.Reply')}
              </Button>
            )}
            {isReplying && (
              <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t('threads.Write a reply...')}
                  className="mb-2"
                />
                <Button type="submit" size="sm" className="flex items-center gap-1">
                  <Send size={14} />
                  {t('threads.Send')}
                </Button>
              </form>
            )}
          </div>
        </div>
        {comment.replies.map((reply) => renderComment(reply, level + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('threads.Comments')}</h3>
      {comments.map((comment) => renderComment(comment))}
      {profile && (
        <form onSubmit={(e) => handleSubmit(e)} className="mt-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('threads.Write a comment...')}
            className="mb-2"
          />
          <Button type="submit" className="flex items-center gap-1">
            <Send size={16} />
            {t('threads.Post Comment')}
          </Button>
        </form>
      )}
    </div>
  );
};

export default Threads; 