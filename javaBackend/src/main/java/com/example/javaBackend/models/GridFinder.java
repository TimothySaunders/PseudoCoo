package com.example.javaBackend.models;

import org.bytedeco.javacpp.indexer.UByteBufferIndexer;
import org.bytedeco.javacv.CanvasFrame;
import org.bytedeco.javacv.OpenCVFrameConverter;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Size;
import org.opencv.core.MatOfByte;
import org.opencv.imgcodecs.Imgcodecs;
import org.springframework.web.multipart.MultipartFile;


import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;


import static org.bytedeco.opencv.global.opencv_core.bitwise_not;
import static org.bytedeco.opencv.global.opencv_imgcodecs.imdecode;

import org.bytedeco.javacpp.indexer.UByteRawIndexer;
import org.bytedeco.opencv.opencv_core.*;
import org.bytedeco.opencv.opencv_core.Point;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.bytedeco.opencv.global.opencv_core.*;
import static org.bytedeco.opencv.global.opencv_imgcodecs.imencode;
import static org.bytedeco.opencv.global.opencv_imgproc.*;

public class GridFinder {

    public MultipartFile image;

    public GridFinder(MultipartFile image) {
        this.image = image;
    }

    public MultipartFile getImage() {
        return image;
    }

    public byte[] convert() throws IOException {
        byte[] stream = image.getBytes();
        System.out.println("1" + "  " + ts());
        Mat pic = imdecode(new Mat(stream), 0);
        System.out.println("2" + "  " + ts());
        Mat sudoku = resizeImage(pic);
        System.out.println("3" + "  " + ts());
        Mat outerBox = sudoku.clone();
        System.out.println("4" + "  " + ts());
        denoise(sudoku, outerBox);
        System.out.println("5" + "  " + ts());
        dilateImage(outerBox);
        System.out.println("6" + "  " + ts());
        Mat alt = outerBox.clone();
        System.out.println("7" + "  " + ts());
        alt = findGrid(outerBox, alt);
        System.out.println("8" + "  " + ts());
        erodeImage(alt);
        System.out.println("9" + "  " + ts());
        erodeImage(outerBox);
        System.out.println("10" + "  " + ts());
        System.out.println(alt.isContinuous());
//        return alt;
        byte[] bytes = new byte[alt.cols() * alt.rows() * alt.channels()];
        imencode(".jpg", alt, bytes);
        return bytes;
    }

    public Mat resizeImage(Mat imported) {
        Mat sudoku = new Mat();
        // resize large image
        int wid = imported.cols();
        int hei = imported.rows();
        int bigger = Math.max(wid, hei);
        if (bigger > 800) {
            int newX;
            int newY;
            if (bigger == wid) {
                newX = 800;
                double scale = 800 / (double) wid;
                newY = (int) (hei * scale);
            } else {
                newY = 800;
                double scale = 800 / (double) hei;
                newX = (int) (wid * scale);
            }
            resize(imported, sudoku, new Size(newX, newY), 0, 0, INTER_AREA);
        } else {
            sudoku = imported.clone();
        }
        return sudoku;
    }

    public void denoise(Mat sudoku, Mat outerBox) {
        // run a gaussian blur to filter out noise
        GaussianBlur(sudoku, sudoku, new Size(13, 13), 0);
        // run adaptive threshold to improve contrast
        adaptiveThreshold(sudoku, outerBox, 255, ADAPTIVE_THRESH_MEAN_C, THRESH_BINARY, 3, 2);
        // invert colours
        bitwise_not(outerBox, outerBox);
    }

    public void dilateImage(Mat image) {
        Mat kernel = Mat.ones(3, 3, CV_32F).asMat();
        dilate(image, image, kernel);
    }

    public void erodeImage(Mat image) {
        Mat kernel = Mat.ones(3, 3, CV_32F).asMat();
        erode(image, image, kernel);
    }

    public Mat findGrid(Mat outerBox, Mat alt) {
        int max = -1;
        Point maxPt = new Point(0, 0);
        UByteRawIndexer sI = outerBox.createIndexer();
        for (int y = 0; y < outerBox.rows(); y++) {
            for (int x = 0; x < outerBox.cols(); x++) {
                if (sI.get(y, x) > 200) {
                    int area = floodFill(alt, new Point(x, y), Scalar.GRAY);
                    if (area > max) {
                        maxPt = new Point(x, y);
                        max = area;
                    }
                }
            }
        }
        System.out.println("first step" + "  " + ts());
//        System.out.println("x: " + maxPt.x() + "  " + ts());
//        System.out.println("y: " + maxPt.y() + "  " + ts());
        floodFill(alt, maxPt, Scalar.WHITE);
        sI = alt.createIndexer();
        for (int y = 0; y < outerBox.rows(); y++) {
            for (int x = 0; x < outerBox.cols(); x++) {
                if (sI.get(y, x) < 255 && sI.get(y, x) > 0) {
                    int area = floodFill(alt, new Point(x, y), Scalar.BLACK);
                }
            }
        }
        System.out.println("second step" + "  " + ts());
        alt = warpPerspectivePuzzle(alt, outerBox, maxPt);
        System.out.println("third step" + "  " + ts());
        sI = alt.createIndexer();
        for (int x = 0; x < alt.cols(); x++) {
            for (int y = 0; y < alt.rows(); y++) {
                if (x == 0 || x == alt.cols() - 1) {
                    if (sI.get(y, x) < 200) {
                        floodFill(alt, new Point(x, y), Scalar.BLACK);
                    }
                }
                if (y == 0 || y == alt.rows() - 1) {
                    if (sI.get(y, x) < 200) {
                        floodFill(alt, new Point(x, y), Scalar.BLACK);
                    }
                }
            }
        }
        System.out.println("finish warp" + "  " + ts());
        return alt;
    }

    public Mat warpPerspectivePuzzle(Mat image, Mat output, Point gridPoint) {
        image = deskewImage(image);
        output = deskewImage(output);
        Rect rect = getLargestRect(image);
        Point2f srcPts = new Point2f(4);
        srcPts.position(0).x((float) rect.x()).y((float) rect.y());
        srcPts.position(1).x((float) rect.x() + rect.width()).y((float) rect.y());
        srcPts.position(2).x((float) rect.x() + rect.width()).y((float) rect.y() + rect.height());
        srcPts.position(3).x((float) rect.x()).y((float) rect.y() + rect.height());
        Point2f dstPts = new Point2f(4);
        dstPts.position(0).x(0).y(0);
        dstPts.position(1).x(500 - 1).y(0);
        dstPts.position(2).x(500 - 1).y(500 - 1);
        dstPts.position(3).x(0).y(500 - 1);
        floodFill(output, gridPoint, Scalar.BLACK);
        Mat p = getPerspectiveTransform(srcPts.position(0), dstPts.position(0));
        Mat img = new Mat(new Size(500, 500), image.type());//image.size()
        warpPerspective(output, img, p, img.size());
        return img;
    }

    public Mat deskewImage(Mat img) {
        MatVector countours = new MatVector();
        List<Double> araes = new ArrayList<>();
        findContours(img, countours, CV_RETR_TREE, CV_CHAIN_APPROX_SIMPLE, new Point(0, 0));
        for (int i = 0; i < countours.size(); i++) {
            Mat c = countours.get(i);
            double area = contourArea(c);
            araes.add(area);
        }
        if (araes.isEmpty()) {
            return img;
        } else {
            Double d = Collections.max(araes);
            RotatedRect minAreaRect = minAreaRect(countours.get(araes.indexOf(d)));
            float angle = minAreaRect.angle();
            if (angle < -45) {
                angle = -(90 + angle);
            } else {
                angle = -angle;
            }
            Mat rot = getRotationMatrix2D(minAreaRect.center(), angle, 1);
//            Mat dst = new Mat(img.size(), img.type());
            warpAffine(img, img, rot, img.size(), WARP_INVERSE_MAP | INTER_LINEAR, 0, new Scalar(0, 0, 0, 0));
            return img;
        }
    }

    /*Get the largest Rectangle of an image*/
    public Rect getLargestRect(Mat img) {
        MatVector contours = new MatVector();
        List<Rect> rects = new ArrayList<>();
        List<Double> areas = new ArrayList<>();
        findContours(img, contours, CV_RETR_LIST, CV_CHAIN_APPROX_SIMPLE, new Point(0, 0));
        for (int i = 0; i < contours.size(); i++) {
            Mat c = contours.get(i);
            double area = contourArea(c);
            Rect boundingRect = boundingRect(c);
            areas.add(area);
            rects.add(boundingRect);
        }
        if (areas.isEmpty() || Collections.max(areas) < 4000) {
            return new Rect(0, 0, img.cols(), img.rows());
        } else {
            Double d = Collections.max(areas);
            return rects.get(areas.indexOf(d));
        }
    }

    public static String ts() {
        return "Timestamp: " + new Timestamp(new java.util.Date().getTime());
    }


}

