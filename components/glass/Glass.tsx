import type { ComponentPropsWithRef, CSSProperties, ElementType, ReactNode } from 'react';

type GlassOwnProps<T extends ElementType> = {
  as?: T;
  /** Use the SVG displacement filter (#liquid) on top of the blur. Chromium only; others fall back to blur. */
  refract?: boolean;
  /** Corner radius, written to --r. Numbers are px. */
  radius?: number | string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export type GlassProps<T extends ElementType = 'div'> = GlassOwnProps<T> &
  Omit<ComponentPropsWithRef<T>, keyof GlassOwnProps<T>>;

/**
 * Liquid-glass surface. Always renders <span class="lg"/> as its first child:
 * the backdrop-filter lives on that layer, never on the element itself.
 */
export function Glass<T extends ElementType = 'div'>({
  as,
  refract,
  radius,
  className,
  style,
  children,
  ...rest
}: GlassProps<T>) {
  const Tag: ElementType = as ?? 'div';
  const cls = ['glass', refract && 'refract', className].filter(Boolean).join(' ');
  const st =
    radius === undefined
      ? style
      : ({ ...style, '--r': typeof radius === 'number' ? `${radius}px` : radius } as CSSProperties);
  return (
    <Tag className={cls} style={st} {...rest}>
      <span className="lg" aria-hidden="true" />
      {children}
    </Tag>
  );
}
