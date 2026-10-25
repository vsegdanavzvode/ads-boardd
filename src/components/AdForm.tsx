import { useState, type FormEvent } from 'react';
import { createAd } from '../api';

interface AdFormProps {
  onCreated: () => Promise<void>;
}

function AdForm({ onCreated }: AdFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const numericPrice = Number(price);

    if (!title.trim() || !description.trim() || !image) {
      setError('Заполните все поля и выберите фотографию.');
      return;
    }

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      setError('Цена должна быть числом не меньше нуля.');
      return;
    }

    if (!image.type.startsWith('image/')) {
      setError('Выберите файл изображения.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await createAd({
        title: title.trim(),
        description: description.trim(),
        price: numericPrice,
        image
      });
      setTitle('');
      setDescription('');
      setPrice('');
      setImage(null);
      form.reset();
      await onCreated();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Не удалось добавить объявление.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="form-section">
      <h2>Новое объявление</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Название</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={80}
            placeholder="Например, настольная лампа"
          />
        </label>

        <label>
          <span>Описание</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={500}
            rows={5}
            placeholder="Кратко опишите товар"
          />
        </label>

        <label>
          <span>Цена, сом</span>
          <input
            type="number"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            min="0"
            step="0.01"
            placeholder="0"
          />
        </label>

        <label>
          <span>Фотография</span>
          <input
            className="file-input"
            type="file"
            accept="image/*"
            onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          />
        </label>

        <p className="form-error" aria-live="polite">
          {error}
        </p>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Отправка...' : 'Добавить объявление'}
        </button>
      </form>
    </section>
  );
}

export default AdForm;
