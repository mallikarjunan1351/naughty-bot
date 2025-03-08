'use client';

import { User } from '../lib/store/slices/usersSlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface UserSectionProps {
  currentUser: any;
  users: User[];
}

export default function UserSection({ currentUser, users }: UserSectionProps) {
  // Get a subset of users to display
  const suggestedUsers = users.slice(0, 5).filter(user => user.id.toString() !== currentUser.id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={currentUser.image || ''} alt={currentUser.name || ''} />
              <AvatarFallback>{currentUser.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Suggested Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={`https://avatars.dicebear.com/api/avataaars/${user.username}.svg`} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                    {user.company.catchPhrase}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 