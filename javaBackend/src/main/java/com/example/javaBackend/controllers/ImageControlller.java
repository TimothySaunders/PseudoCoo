package com.example.javaBackend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
public class ImageControlller {

    @PostMapping("/images")
    public ResponseEntity processImage(@RequestBody MultipartFile file) throws IOException {
//        System.out.println(imageData);
        byte[] bytes = file.getBytes();
        System.out.println(bytes);
        return new ResponseEntity("hello", HttpStatus.OK);
    }
}
