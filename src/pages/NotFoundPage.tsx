import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowLeft } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-12">
      <EmptyState
        icon={<Trophy className="w-10 h-10 text-amber-500" />}
        title="404 - Page Not Found"
        description="The championship page or resource you requested does not exist or has been relocated."
        action={
          <Link to="/">
            <Button size="md" className="font-russo">
              <ArrowLeft className="w-4 h-4 mr-1" /> Return Home
            </Button>
          </Link>
        }
      />
    </div>
  );
};
