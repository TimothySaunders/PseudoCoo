package com.example.javaBackend.controllers;

import com.example.javaBackend.models.CowJoke;
import com.example.javaBackend.repositories.CowJokeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CowJokeController {

    @Autowired
    CowJokeRepository cowJokeRepository;

    @GetMapping(value = "/jokes")
    public ResponseEntity<List<CowJoke>> getAllCowJokes(){
        return new ResponseEntity<>(cowJokeRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping(value = "/jokes/{id}")
    public ResponseEntity getCowJoke(@PathVariable Long id){
        return new ResponseEntity<>(cowJokeRepository.findById(id), HttpStatus.OK);
    }

}
