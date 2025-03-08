'use client';

import { useState, useEffect } from 'react';
import { Comment } from '../lib/store/slices/commentsSlice';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

interface CommentListProps {
  postId: number;
  theme?: 'dark' | 'light';
}

export default function CommentList({ postId, theme = 'light' }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editText, setEditText] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch comments for the post
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Add a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/comments', {
        method: 'POST',
        body: JSON.stringify({
          postId,
          name: 'Current User',
          email: 'you@example.com',
          body: newComment
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // JSONPlaceholder doesn't actually create the resource, so we'll simulate it
        const newCommentObj = {
          ...data,
          id: Math.max(...comments.map(c => c.id), 0) + 1 // Generate a unique ID
        };
        setComments([...comments, newCommentObj]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Edit a comment
  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setEditText(comment.body);
    setIsDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingComment || !editText.trim()) return;

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments/${editingComment.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...editingComment,
          body: editText
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (response.ok) {
        // JSONPlaceholder doesn't actually update the resource, so we'll simulate it
        const updatedComments = comments.map(comment => 
          comment.id === editingComment.id 
            ? { ...comment, body: editText } 
            : comment
        );
        setComments(updatedComments);
        setIsDialogOpen(false);
        setEditingComment(null);
        setEditText('');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // JSONPlaceholder doesn't actually delete the resource, so we'll simulate it
        const updatedComments = comments.filter(comment => comment.id !== commentId);
        setComments(updatedComments);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Check if a comment is from the current user (for demo purposes)
  const isCurrentUserComment = (comment: Comment) => {
    return comment.email === 'you@example.com';
  };

  return (
    <div className="w-full space-y-4 mt-2">
      <h4 className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        Comments
      </h4>
      
      {/* Add new comment */}
      <div className="flex space-x-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
        />
        <Button onClick={handleAddComment}>Post</Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div 
              key={comment.id} 
              className={`p-3 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-700/70 border border-gray-600' 
                  : 'bg-gray-100/80 border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6 bg-gray-200">
                    <AvatarFallback>
                      {comment.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {comment.email}
                  </p>
                </div>
                
                {isCurrentUserComment(comment) && (
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => handleEditComment(comment)}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                )}
              </div>
              
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {comment.body}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Edit Comment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700 text-white' 
            : 'bg-white border-gray-200'
        }>
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>
          
          {editingComment && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6 bg-gray-200">
                  <AvatarFallback>
                    {editingComment.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {editingComment.email}
                </p>
              </div>
              
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
              />
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className={theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : ''}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 