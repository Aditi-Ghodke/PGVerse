package com.pgverse.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pgverse.entities.Review;
import com.pgverse.entities.User;
import com.pgverse.entities.PgProperty;
import java.util.List;



public interface ReviewDao extends JpaRepository<Review, Long> {
	 boolean existsByUserAndPgProperty(User user, PgProperty pgProperty);
	 Optional<Review> findByReviewId(Long reviewId);
	 List<Review> findByUser(User user);
	 List<Review> findByPgProperty(PgProperty pgProperty);
}
