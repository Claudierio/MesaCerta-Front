import React from "react";
import styles from "@/app/(general)/restaurant/[id]/restaurantDetails.module.scss";
import useRenderStars from "@/app/shared/hooks/RenderStars/useRenderStars";
import { IRestaurantData } from "@/app/shared/@types";
import useRatings from "@/app/shared/hooks/Rating/useRatings";
import { useRouter } from "next/navigation";

type RatingsSectionProps = {
  item: IRestaurantData;
};

export const RatingsSection: React.FC<RatingsSectionProps> = ({ item }) => {
  const itemType = "restaurant";
  const ratings = useRatings([item], itemType);
  const rating = ratings[item.id!];
  const router = useRouter();

  const stars = useRenderStars(rating ? rating.averageRating : 0);

  const handleViewReviews = () => {
    router.push(`/restaurant/${item.id}/reviews`);
  };

  return (
    <section className={styles.infoSection}>
      <div className={styles.ratings}>
        <h2>Pontuações e avaliações</h2>
        {rating ? (
          <div className={styles.overallRating}>
            <span className={styles.score}>
              {rating.averageRating.toFixed(1)}
            </span>
            <div className={styles.stars}>{stars}</div>
            <span className={styles.totalReviews}>
              {rating.totalReviews} avaliação
              {rating.totalReviews !== 1 ? "s" : ""}
            </span>
          </div>
        ) : (
          <p>Carregando avaliações...</p>
        )}
      </div>
      <button onClick={handleViewReviews} className={styles.buttonEvaluations}>
        Ver Avaliações
      </button>
    </section>
  );
};
