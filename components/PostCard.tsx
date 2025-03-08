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
import { MessageSquare, Heart, Share2, Trash2, Edit, X } from 'lucide-react';

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
    <Card className="dark:bg-gray-800 dark:border-gray-700">
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
            <p className="font-medium dark:text-white">{author?.name || 'Unknown User'}</p>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {author?.company?.name || 'Company'}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold dark:text-white">{post.title}</h3>
        <p className="text-muted-foreground dark:text-gray-300">{post.body}</p>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4 pt-0">
        <div className="flex items-center justify-between w-full border-t border-b py-2 dark:border-gray-700">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-1 dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{likeCount}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-1 dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{comments.length}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-1 dark:text-gray-300 dark:hover:bg-gray-700"
          >
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
                className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <Button 
                size="sm" 
                onClick={handleAddComment}
                className="dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Post
              </Button>
            </div>
            
            {/* Edit Comment Modal */}
            {editingComment && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4">
                  <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-medium dark:text-white">Edit Comment</h3>
                    <button 
                      onClick={() => setEditingComment(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{editingComment.email[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium dark:text-white">{editingComment.email}</span>
                      
                      <div className="ml-auto flex space-x-1">
                        <button 
                          onClick={() => handleEditComment(editingComment)}
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteComment(editingComment.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <Textarea
                      value={editedCommentText}
                      onChange={(e) => setEditedCommentText(e.target.value)}
                      className="w-full min-h-[100px] p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 p-4 border-t dark:border-gray-700">
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingComment(null)}
                      className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpdateComment}
                      className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-md dark:bg-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{comment.email[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium dark:text-white">{comment.email}</span>
                    </div>
                    
                    {/* Only show edit/delete for current user's comments (for demo purposes) */}
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 dark:text-gray-300 dark:hover:bg-gray-600" 
                        onClick={() => handleEditComment(comment)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 dark:text-gray-300 dark:hover:bg-gray-600" 
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm mt-1 dark:text-gray-200">{comment.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
} 