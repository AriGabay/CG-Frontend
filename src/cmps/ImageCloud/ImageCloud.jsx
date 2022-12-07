import './ImageCloud.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'cloudinary-react';
import { Placeholder } from 'cloudinary-react';
export function ImageCloud({
  alt,
  maxHeight,
  maxWidth,
  imageId = 'old_logo_rssqwk',
  ClassName,
  style,
}) {
  const src = () => {
    if (imageId === '') imageId = 'old_logo_rssqwk';
    const width = maxWidth;
    const height = maxHeight;
    return `https://res.cloudinary.com/cgabay/image/upload/c_scale,${
      width ? 'w_' + width : ''
    }${width && height ? ',' : ''}${
      height ? 'h_' + height : ''
    }/v1614944384/${imageId}`;
  };
  return (
    <Image
      className={ClassName}
      alt={alt}
      src={src()}
      gravity="faces"
      loading="lazy"
      height={maxHeight}
      width={maxWidth}
      style={style ?? {}}
    >
      <Placeholder type="blur"></Placeholder>
    </Image>
  );
}
ImageCloud.propsTypes = {
  maxHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  alt: PropTypes.string,
  imageId: PropTypes.element.isRequired,
  ClassName: PropTypes.string,
  style: PropTypes.any,
};
ImageCloud.defaultProps = {
  maxHeight: 250,
  ClassName: ' ',
};
