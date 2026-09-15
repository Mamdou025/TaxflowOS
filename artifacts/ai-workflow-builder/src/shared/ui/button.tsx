import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { buttonVariants, legacyButtonVariants } from './button-variants';

type ButtonBaseProps = React.ComponentProps<'button'> & { asChild?: boolean };
export type LegacyButtonProps = ButtonBaseProps & VariantProps<typeof legacyButtonVariants>;

// React 19 forwards ref through props, for both normal buttons and slotted links.
function ButtonPrimitive({ asChild = false, ...props }: ButtonBaseProps) {
  const Component = asChild ? Slot : 'button';
  return <Component {...props} />;
}
export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonBaseProps & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
export function LegacyButton({ className, variant, size, ...props }: LegacyButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(legacyButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
export { buttonVariants } from './button-variants';
