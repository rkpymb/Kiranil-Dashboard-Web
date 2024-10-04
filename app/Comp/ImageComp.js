'use client';
import React from 'react';
import Mstyles from '@/app/styles/mystyle.module.css';
import Image from 'next/image';

const ImageComp = ({
  imgClass,
  imgSrc,
  imgAlt,
  objectFit,
  layout,
  width,
  height
}) => {
  const blurredImageData =
    'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88enTfwAJYwPNteQx0wAAAABJRU5ErkJggg==';

  return (
    <div className={`${Mstyles[imgClass]}`}>
      <Image
        src={imgSrc}
        alt={imgAlt}
        width={width}
        height={height}
        placeholder="blur"
        blurDataURL={blurredImageData}
        layout={layout}
        objectFit={objectFit}
      />
    </div>
  );
};

export default ImageComp;
