package com.example.javaBackend.models;

import com.example.javaBackend.helpers.HoughLines;
import org.bytedeco.javacpp.BytePointer;
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
import static org.bytedeco.opencv.global.opencv_imgcodecs.*;
import static org.bytedeco.opencv.global.opencv_imgproc.*;

public class GridFinder {

    public MultipartFile image;
    public String imageLoc;

    public GridFinder(MultipartFile image) {
        this.image = image;
    }

    public GridFinder(String fileLoc) {
        this.imageLoc = fileLoc;
    }

    public MultipartFile getImage() {
        return image;
    }

    public Mat testConvert() {
        Mat imported = imread(this.imageLoc, 0);
        Mat sudoku = resizeImage(imported);
        System.out.println("3" + "  " + ts());
        Mat outerBox = sudoku.clone();
        System.out.println("4" + "  " + ts());
        outerBox = denoise(sudoku);
        outerBox = invertImage(outerBox);
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
        return alt;
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
        outerBox = denoise(sudoku);
        outerBox = invertImage(outerBox);
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
        if (bigger > 1000) {
            int newX;
            int newY;
            if (bigger == wid) {
                newX = 1000;
                double scale = 1000 / (double) wid;
                newY = (int) (hei * scale);
            } else {
                newY = 1000;
                double scale = 1000 / (double) hei;
                newX = (int) (wid * scale);
            }
            resize(imported, sudoku, new Size(newX, newY), 0, 0, INTER_AREA);
        } else {
            sudoku = imported.clone();
        }
        return sudoku;
    }

    public Mat denoise(Mat sudoku) {
        Mat image = sudoku.clone();
        // run a gaussian blur to filter out noise
        GaussianBlur(sudoku, image, new Size(13, 13), 0);
        // run adaptive threshold to improve contrast
        adaptiveThreshold(image, image, 255, ADAPTIVE_THRESH_MEAN_C, THRESH_BINARY, 3, 2);
        return image;
    }

    public Mat invertImage(Mat image) {
        // invert colours
        bitwise_not(image, image);
        return image;
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
        Rect bound = getLargestRect(outerBox);
        int count = 0;
        int max = -1;
        Point maxPt = new Point(0, 0);
        ArrayList<Point> smallPoints = new ArrayList<>();
        UByteRawIndexer sI = outerBox.createIndexer();
//        for (int y = bound.y(); y < bound.y() + bound.height(); y += 2) {
//            BytePointer row = outerBox.ptr(y);
//            for (int x = bound.x(); x < bound.x() + bound.width(); x += 2) {
        for (int y = 0; y < outerBox.rows(); y+=2) {
            BytePointer row = outerBox.ptr(y);
            for (int x = 0; x < outerBox.cols(); x+=2) {
//                System.out.println(row.get(x));
                if (row.get(x) < 0) {
//                if (sI.get(y, x) > 200) {
                    count += 1;
//                    int area = -2;
                    Point pt = new Point(x, y);
                    int area = floodFill(outerBox, pt, Scalar.GRAY);
                    if (area > max) {
                        maxPt = pt;
                        max = area;
                    }
                    if (area < 50) {
                        smallPoints.add(pt);
                    }
                }
            }
        }
        for (Point pt : smallPoints) {
            floodFill(alt, pt, Scalar.BLACK);
        }
        System.out.println("floodfilled " + count + " times");
        System.out.println("first step" + "  " + ts());
//        System.out.println("x: " + maxPt.x() + "  " + ts());
//        System.out.println("y: " + maxPt.y() + "  " + ts());
        floodFill(outerBox, maxPt, Scalar.WHITE);

        sI = outerBox.createIndexer();
        int toBlackCount = 0;
        for (int y = 0; y < outerBox.rows(); y++) {
            for (int x = 0; x < outerBox.cols(); x++) {
                if (sI.get(y, x) < 255 && sI.get(y, x) > 0) {
                    toBlackCount++;
                    floodFill(outerBox, new Point(x, y), Scalar.BLACK);
                }
            }
        }
        System.out.println(toBlackCount);
        System.out.println("second step" + "  " + ts());


        HoughLines hl = new HoughLines(outerBox);
        CvSeq lines = hl.lines();

//        hl.warpGrid(lines, alt);



        alt = warpPerspectivePuzzle(outerBox, alt, maxPt);
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
        floodFill(output, gridPoint, Scalar.BLACK);
//        image = deskewImage(image);
//        output = deskewImage(output);
        float skewAngle = getDeSkewAngle(image);
        RotatedRect minAreaRect = getDeSkewRotatedRect(image);
        output = deskewImage(output, skewAngle, minAreaRect);
        image = deskewImage(image, skewAngle, minAreaRect);
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

        Mat p = getPerspectiveTransform(srcPts.position(0), dstPts.position(0));
        Mat img = new Mat(new Size(500, 500), image.type());//image.size()
        warpPerspective(output, img, p, img.size());
        return img;
    }

    public float getDeSkewAngle(Mat img) {
        MatVector countours = new MatVector();
        List<Double> araes = new ArrayList<>();
        findContours(img, countours, CV_RETR_TREE, CV_CHAIN_APPROX_SIMPLE, new Point(0, 0));
        for (int i = 0; i < countours.size(); i++) {
            Mat c = countours.get(i);
            double area = contourArea(c);
            araes.add(area);
        }
        Double d = Collections.max(araes);
        RotatedRect minAreaRect = minAreaRect(countours.get(araes.indexOf(d)));
        float angle = minAreaRect.angle();
        if (angle < -45) {
            angle = -(90 + angle);
        } else {
            angle = -angle;
        }
        return angle;
    }

    public RotatedRect getDeSkewRotatedRect(Mat img) {
        MatVector countours = new MatVector();
        List<Double> araes = new ArrayList<>();
        findContours(img, countours, CV_RETR_TREE, CV_CHAIN_APPROX_SIMPLE, new Point(0, 0));
        for (int i = 0; i < countours.size(); i++) {
            Mat c = countours.get(i);
            double area = contourArea(c);
            araes.add(area);
        }
        Double d = Collections.max(araes);
        return minAreaRect(countours.get(araes.indexOf(d)));
    }

    public Mat deskewImage(Mat img, float angle, RotatedRect minAreaRect) {
        Mat rot = getRotationMatrix2D(minAreaRect.center(), angle, 1);
//            Mat dst = new Mat(img.size(), img.type());
        warpAffine(img, img, rot, img.size(), WARP_INVERSE_MAP | INTER_LINEAR, 0, new Scalar(0, 0, 0, 0));
        return img;
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

    public void display(Mat image, String caption) {
        // Create image window named "My Image".
        final CanvasFrame canvas = new CanvasFrame(caption, 1.0);
        // Request closing of the application when the image window is closed.
        canvas.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        // Convert from OpenCV Mat to Java Buffered image for display
        final OpenCVFrameConverter<Mat> converter = new OpenCVFrameConverter.ToMat();
        // Show image on window.
        canvas.showImage(converter.convert(image));
    }
}

