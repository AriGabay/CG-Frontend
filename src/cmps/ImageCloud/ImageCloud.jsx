import './ImageCloud.scss';
import { Image } from 'cloudinary-react';
import PropTypes from 'prop-types';
export function ImageCloud({ alt, maxHeight, maxWidth, imageId }) {
  const src = () => {
    const width = maxWidth;
    const height = maxHeight;
    return `https://res.cloudinary.com/cgabay/image/upload/c_scale,${width ? 'w_' + width : ''}${
      width && height ? ',' : ''
    }${height ? 'h_' + height : ''}/v1614944384/${imageId}`;
  };
  return <Image alt={alt} src={src()} gravity="faces" loading="lazy" height={maxHeight} width={maxWidth} />;
}
ImageCloud.propsTypes = {
  maxHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  alt: PropTypes.string,
  imageId: PropTypes.element.isRequired,
};
ImageCloud.defaultProps = {
  maxHeight: 250,
};
