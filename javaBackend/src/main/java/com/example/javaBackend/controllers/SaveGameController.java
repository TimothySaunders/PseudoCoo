package com.example.javaBackend.controllers;

import com.example.javaBackend.models.SaveGame;
import com.example.javaBackend.repositories.SaveGameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SaveGameController {

    @Autowired
    SaveGameRepository saveGameRepository;

    @GetMapping(value = "/saves")
    public ResponseEntity<List<SaveGame>> getAllSaveGames(){
        return new ResponseEntity<>(saveGameRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping(value = "/saves/{id}")
    public ResponseEntity getSaveGame(@PathVariable Long id){
        return new ResponseEntity<>(saveGameRepository.findById(id), HttpStatus.OK);
    }

    @PostMapping(value = "/saves")
    public ResponseEntity<SaveGame> postSaveGame(@RequestBody SaveGame saveGame){
        saveGameRepository.save(saveGame);
        return new ResponseEntity<>(saveGame, HttpStatus.CREATED);
    }

    @PatchMapping(value = "/saves/{id}")
    public ResponseEntity<SaveGame> updateSaveGame(@RequestBody SaveGame saveGame){
        saveGameRepository.save(saveGame);
        return new ResponseEntity<>(saveGame, HttpStatus.OK);
    }

    @DeleteMapping(value = "/saves/{id}")
    public ResponseEntity<SaveGame> deleteSaveGame(@PathVariable Long id) {
        SaveGame found = saveGameRepository.getOne(id);
        saveGameRepository.delete(found);
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

}
