import { useState } from 'react';
import { getImageUrl } from '../api';
import type { Ad } from '../types';

interface AdCardProps {
  ad: Ad;
}

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 2
});

function AdCard({ ad }: AdCardProps) {
  const [imageError, setImageError] = useState(false);
  const price = ad.price === 0 ? 'Бесплатно' : `${priceFormatter.format(ad.price)} сом`;

  return (
    <article className="ad-card">
      <div className="ad-image">
        {imageError ? (
          <span>Фото недоступно</span>
        ) : (
          <img
            src={getImageUrl(ad.image_url)}
            alt={ad.title}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="ad-content">
        <h3>{ad.title}</h3>
        <p>{ad.description}</p>
        <strong>{price}</strong>
      </div>
    </article>
  );
}

export default AdCard;
