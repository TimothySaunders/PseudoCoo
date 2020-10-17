package com.example.javaBackend.repositories;

import com.example.javaBackend.models.SaveGame;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaveGameRepository extends JpaRepository<SaveGame, Long> {

}
