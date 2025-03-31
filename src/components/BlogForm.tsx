
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Blog } from '@/context/BlogContext';

type BlogFormProps = {
  onSubmit: (data: BlogFormValues) => void;
  initialData?: Partial<Blog>;
  isSubmitting?: boolean;
};

export type BlogFormValues = {
  title: string;
  subtitle?: string;
  content: string;
  imageUrl?: string;
};

const BlogForm: React.FC<BlogFormProps> = ({
  onSubmit,
  initialData,
  isSubmitting = false,
}) => {
  const form = useForm<BlogFormValues>({
    defaultValues: {
      title: initialData?.title || '',
      subtitle: initialData?.subtitle || '',
      content: initialData?.content || '',
      imageUrl: initialData?.imageUrl || '',
    },
  });

  const handleSubmit = (data: BlogFormValues) => {
    try {
      onSubmit(data);
    } catch (error) {
      toast.error('Failed to submit blog post.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter blog title"
                  {...field}
                  className="text-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter blog subtitle"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter image URL"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your blog content here..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData?._id ? 'Update Blog' : 'Create Blog'}
        </Button>
      </form>
    </Form>
  );
};

export default BlogForm;
