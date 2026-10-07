import type { CSSProperties } from 'react';
import { METERS, meterLevel, type Product } from '@/lib/products';

export function Meters({ product, big }: { product: Product; big?: boolean }) {
  return (
    <div className={big ? 'meters big' : 'meters'}>
      {METERS.map((label, i) => {
        const v = product.m[i];
        return (
          <div className="meter" key={label}>
            <span>{label}</span>
            <span
              className="mt"
              role="meter"
              aria-label={label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={v}
            >
              <span className={`mf ${meterLevel(v)}`} style={{ '--v': `${v}%` } as CSSProperties} />
            </span>
            {big && <span className="mv">{v}</span>}
          </div>
        );
      })}
    </div>
  );
}
