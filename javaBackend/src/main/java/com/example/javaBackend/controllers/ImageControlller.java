package com.example.javaBackend.controllers;

import com.example.javaBackend.models.GridFinder;
import org.bytedeco.javacpp.BytePointer;
import org.bytedeco.opencv.opencv_core.Mat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.Buffer;
import java.nio.ByteBuffer;
import java.util.Optional;

import static org.bytedeco.opencv.global.opencv_imgcodecs.imencode;

@RestController
public class ImageControlller {

    @PostMapping("/images")
    public ResponseEntity processImage(@RequestParam("sudoku") MultipartFile file)  {
        GridFinder grid = new GridFinder(file);
        byte[] output = null;
        try {
            output = grid.convert();

            final HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);

            System.out.println("finished the conversion");
            System.out.println("sending response...");
            return new ResponseEntity(output, headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity(null, HttpStatus.I_AM_A_TEAPOT);
        }
    }
}
