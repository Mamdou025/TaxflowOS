import React, { Suspense } from 'react';
type DynamicOptions = {
  ssr?: boolean;
  loading?: () => React.ReactElement | null;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dynamic<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T } | T>,
  options?: DynamicOptions
): T {
  const LazyComponent = React.lazy(async () => {
    const mod = await importFn();
    if ('default' in mod) return mod as { default: T };
    return { default: mod as T };
  });
  const LoadingFallback = options?.loading ? options.loading() : null;
  const Wrapper = (props: React.ComponentProps<T>) => (
    <Suspense fallback={LoadingFallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
  return Wrapper as unknown as T;
}
export default dynamic;
