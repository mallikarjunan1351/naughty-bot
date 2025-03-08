'use client';

import { useState } from 'react';
import { Comment } from '../types';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

interface CommentListProps {
  comments: Comment[];
  currentUserId: number;
  theme?: 'dark' | 'light';
}

export default function CommentList({ comments, currentUserId, theme = 'light' }: CommentListProps) {
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editText, setEditText] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setEditText(comment.body);
    setIsDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingComment || !editText.trim()) return;

    const updatedComments = localComments.map(comment => 
      comment.id === editingComment.id 
        ? { ...comment, body: editText } 
        : comment
    );

    setLocalComments(updatedComments);
    setIsDialogOpen(false);
    setEditingComment(null);
    setEditText('');
  };

  const handleDeleteComment = (commentId: number) => {
    const updatedComments = localComments.filter(comment => comment.id !== commentId);
    setLocalComments(updatedComments);
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
      
      <div className="space-y-4">
        {localComments.map(comment => (
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