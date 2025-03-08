'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../lib/store/store';
import { Post } from '../lib/store/slices/postsSlice';
import { Comment, addComment, updateComment, deleteComment } from '../lib/store/slices/commentsSlice';
import { User } from '../lib/store/slices/usersSlice';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { MessageSquare, Heart, Share2, Trash2, Edit } from 'lucide-react';

interface PostCardProps {
  post: Post;
  author?: User;
  comments: Comment[];
  currentUserId: string;
}

export default function PostCard({ post, author, comments, currentUserId }: PostCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Use useEffect to set random like count on client-side only
  useEffect(() => {
    setLikeCount(Math.floor(Math.random() * 50));
  }, []);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Omit<Comment, 'id'> = {
      postId: post.id,
      name: 'New Comment',
      email: 'user@example.com',
      body: newComment,
    };

    dispatch(addComment(comment));
    setNewComment('');
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setEditedCommentText(comment.body);
  };

  const handleUpdateComment = () => {
    if (!editingComment || !editedCommentText.trim()) return;

    const updatedComment = {
      ...editingComment,
      body: editedCommentText,
    };

    dispatch(updateComment(updatedComment));
    setEditingComment(null);
  };

  const handleDeleteComment = (id: number) => {
    dispatch(deleteComment(id));
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage 
              src={`https://avatars.dicebear.com/api/avataaars/${author?.username || 'user'}.svg`} 
              alt={author?.name || 'User'} 
            />
            <AvatarFallback>{author?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{author?.name || 'Unknown User'}</p>
            <p className="text-xs text-muted-foreground">
              {author?.company?.name || 'Company'}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <p className="text-muted-foreground">{post.body}</p>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4 pt-0">
        <div className="flex items-center justify-between w-full border-t border-b py-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-1"
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{likeCount}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-1"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{comments.length}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
        
        {showComments && (
          <div className="w-full space-y-4">
            <div className="flex items-center space-x-2 w-full">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={handleAddComment}>Post</Button>
            </div>
            
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{comment.email[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{comment.email}</span>
                    </div>
                    
                    {/* Only show edit/delete for current user's comments (for demo purposes) */}
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => handleEditComment(comment)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm mt-1">{comment.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardFooter>

      {/* Edit Comment Dialog */}
      <Dialog open={!!editingComment} onOpenChange={(open) => !open && setEditingComment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editedCommentText}
            onChange={(e) => setEditedCommentText(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingComment(null)}>Cancel</Button>
            <Button onClick={handleUpdateComment}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 