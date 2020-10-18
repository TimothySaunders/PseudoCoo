package com.example.javaBackend.controllers;

import com.example.javaBackend.models.GridFinder;
import org.bytedeco.opencv.opencv_core.Mat;
import org.springframework.http.HttpStatus;
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
//        System.out.println(imageData);

//            InputStream fileData = file.getInputStream();
        GridFinder grid = new GridFinder(file);
        Mat output = null;
        try {
            output = grid.convert();
            System.out.println("res: " + output.cols() + " x " + output.rows());
            byte[] bytes = output.data().getStringBytes();

//            MultipartEntityBuilder form = new MultipartEntityBuilder();
            System.out.println("finished the conversion");
            System.out.println("sending response...");
            return new ResponseEntity(bytes, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("____________________________________");
            System.out.println("____________________________________");
            System.out.println("____________________________________");
            System.out.println("______________F_U_C_K_______________");
            System.out.println("____________________________________");
            System.out.println("____________________________________");
            System.out.println("____________________________________");
            return new ResponseEntity(null, HttpStatus.I_AM_A_TEAPOT);
        }

    }

}
