/* 
 <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start gap-2 md:flex-row"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full md:w-1/4 md:max-w-[18rem]">
              <FormControl>
                <Input
                  {...field}
                  className="w-full"
                  aria-label="Rubric name"
                  placeholder="Enter a name for your rubric here..."
                />
              </FormControl>
              {form.formState.errors.name && (
                <FormMessage>{form.formState.errors.name.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <Button type="submit">
          <Save className="mr-2" /> Update
        </Button>
*/
import { Skeleton } from "@/components/ui/skeleton";

export const RubricNameSkeleton = () => {
  return (
    <div className="flex w-full flex-col items-start gap-2 md:flex-row">
      <Skeleton className="h-10 w-full md:w-1/4 md:max-w-[18rem]" />
      <Skeleton className="h-10 w-28" />
    </div>
  );
};
