package com.codeclan.example.backend.repositories;

import com.codeclan.example.backend.models.SaveGame;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaveGameRepository extends JpaRepository<SaveGame, Long> {

}
