import React from 'react';
type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  [key: string]: unknown;
};
const Image = ({ src, alt, width, height, className, style, fill, ...rest }: ImageProps) => {
  const imgStyle: React.CSSProperties = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }
    : style || {};
  return <img src={src} alt={alt} width={width} height={height} className={className} style={imgStyle} />;
};
export default Image;
