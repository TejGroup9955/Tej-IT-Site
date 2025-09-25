'use client';
import { useState } from 'react';
import styles from './testimonials.module.css';

export default function TestimonialsPage() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('company', company);
    formData.append('content', content);
    formData.append('rating', rating.toString());
    if (image) formData.append('image', image);

    const response = await fetch('http://10.10.50.93:5000/api/submit_testimonial', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Testimonial submitted successfully! It will be reviewed by the admin.');
      setName('');
      setCompany('');
      setContent('');
      setRating(0);
      setImage(null);
    } else {
      alert('Failed to submit testimonial.');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Submit Your Testimonial</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="company">Company</label>
          <input type="text" id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content">Review</label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="rating">Rating (1-5)</label>
          <input type="number" id="rating" value={rating} onChange={(e) => setRating(parseInt(e.target.value) || 0)} min="1" max="5" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="image">Image</label>
          <input type="file" id="image" onChange={(e) => setImage(e.target.files?.[0] || null)} accept="image/*" />
        </div>
        <button type="submit" className={styles.submitButton}>Submit</button>
      </form>
    </div>
  );
}
