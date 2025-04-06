"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getReviewsByRestaurantId } from "@/app/shared/service/api/ReviewsApi";
import styles from "./reviews.module.scss";
import { FaStar } from "react-icons/fa";
import { IReview } from "@/app/shared/@types";

export default function RestaurantReviews({ params }: { params: { id: string } }) {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await getReviewsByRestaurantId(params.id);
        setReviews(fetchedReviews);
      } catch (error) {
        setError("Erro ao carregar avaliações");
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [params.id]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`${styles.star} ${index < rating ? styles.active : ''}`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className={styles.loading}>Carregando avaliações...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()}>
          ← Voltar
        </button>
        <h1>Avaliações do Restaurante</h1>
      </div>

      <div className={styles.reviewsList}>
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>Ainda não há avaliações para este restaurante.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.stars}>
                  {renderStars(review.rating)}
                </div>
                <span className={styles.date}>{formatDate(review.createdAt)}</span>
              </div>
              <p className={styles.description}>{review.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 