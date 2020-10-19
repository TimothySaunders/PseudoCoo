package com.example.javaBackend.repositories;

import com.example.javaBackend.models.CowJoke;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CowJokeRepository extends JpaRepository<CowJoke, Long> {
}
