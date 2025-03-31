
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

type CommentFormProps = {
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
};

type CommentFormValues = {
  content: string;
};

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const { user } = useAuth();
  const form = useForm<CommentFormValues>({
    defaultValues: {
      content: '',
    },
  });

  const handleSubmit = (data: CommentFormValues) => {
    if (!user) {
      toast.error('You must be logged in to comment.');
      return;
    }

    try {
      onSubmit(data.content);
      form.reset();
    } catch (error) {
      toast.error('Failed to submit comment.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Write a comment..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isSubmitting || !user}
          className="ml-auto"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </form>
    </Form>
  );
};

export default CommentForm;
