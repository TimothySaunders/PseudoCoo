package com.example.javaBackend.helpers;

import org.bytedeco.javacpp.BytePointer;
import org.bytedeco.javacpp.Pointer;
import org.bytedeco.javacpp.indexer.UByteBufferIndexer;
import org.bytedeco.javacpp.indexer.UByteRawIndexer;
import org.bytedeco.javacv.*;
import org.bytedeco.opencv.opencv_core.*;
import org.bytedeco.opencv.opencv_imgproc.Vec4iVector;
import org.bytedeco.opencv.opencv_core.Point;
import javax.swing.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Vector;
import static org.bytedeco.opencv.global.opencv_core.*;
import static org.bytedeco.opencv.global.opencv_imgproc.*;
import static org.bytedeco.opencv.global.opencv_imgcodecs.*;

public class ProcessImage {
    public static void main(String[] args) {
        // Read an image. (grayscale)
        Mat imported = imread("images/sudoku4.jpg", 0);
        Mat sudoku = new Mat();
        // resize large iamge
        int wid = imported.cols();
        int hei = imported.rows();
        int bigger = max(wid, hei);
        if (bigger > 800) {
            int newX;
            int newY;
            if (bigger == wid) {
                newX = 800;
                double scale = 800 / (double) wid;
                newY = (int)(hei * scale);
            } else {
                newY = 800;
                double scale = 800 / (double) hei;
                newX = (int)(wid * scale);
            }
            resize(imported, sudoku, new Size(newX, newY), 0, 0, INTER_AREA);
        } else {
            sudoku = imported.clone();
        }
        System.out.println(sudoku.cols());
        // show it
        display(sudoku, "original");
        // create a blank image to put the processed image in
        Mat outerBox = new Mat(sudoku.size(), CV_8UC1);
        // run a gaussian blur to filter out noise
        GaussianBlur(sudoku, sudoku, new Size(13, 13), 0);
        // run adaptive threshold to improve contrast
        adaptiveThreshold(sudoku, outerBox, 255, ADAPTIVE_THRESH_MEAN_C, THRESH_BINARY, 3, 2);
        // invert colours
        bitwise_not(outerBox, outerBox);
        // embiggens edges
        Mat kernel = Mat.ones(3, 3, CV_32F).asMat();
        dilate(outerBox, outerBox, kernel);
        Mat alt = outerBox.clone();
//        dilate(alt, alt, kernel);
        // use floodfill to get rid of the gridlines
        int count=0;
        int max=-1;
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
        System.out.println("x: " + maxPt.x());
        System.out.println("y: " + maxPt.y());
        floodFill(alt, maxPt, Scalar.WHITE);
        sI = alt.createIndexer();
        for (int y = 0; y < outerBox.rows(); y++) {
            for (int x = 0; x < outerBox.cols(); x++) {
                if (sI.get(y, x) < 255 && sI.get(y, x) > 0) {
                    int area = floodFill(alt, new Point(x, y), Scalar.BLACK);
                }
            }
        }
        alt = warpPerspectivePuzzle(alt, outerBox, maxPt);
        sI = alt.createIndexer();
        for (int x = 0; x < alt.cols(); x++) {
            for (int y = 0; y < alt.rows(); y++) {
                if (x == 0 || x == alt.cols() - 1) {
                    if (sI.get(y, x) < 200) {
                        System.out.println("x: " + x + "   y: " + y);
                        floodFill(alt, new Point(x, y), Scalar.BLACK);
                    }
                }
                if (y == 0 || y == alt.rows() - 1) {
                    if (sI.get(y, x) < 200) {
                        System.out.println("x: " + x + "   y: " + y);
                        floodFill(alt, new Point(x, y), Scalar.BLACK);
                    }
                }
            }
        }
//
        erode(alt, alt, kernel);
        erode(outerBox, outerBox, kernel);
//
        // display the processed image
        bitwise_not(alt, alt);
        display(alt, "alternative");
        display(outerBox, "extracted");
        imwrite("my_image.png", alt);
        // convert to black and white
//        display(bw, "blackwhite");
    }
    private static Mat warpPerspectivePuzzle(Mat image, Mat output, Point gridPoint) {
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
    private static Mat deskewImage(Mat img) {
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
    private static Rect getLargestRect(Mat img) {
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
    /*Check if the captured image contains sudoku pazzle
assume that it has a large square with area > 40000*/
    private static boolean isSudokuExist(Mat img) {
        MatVector contours = new MatVector();
        List<Double> areas = new ArrayList<>();
        findContours(img.clone(), contours, CV_RETR_TREE, CV_CHAIN_APPROX_SIMPLE, new Point(0, 0));
        for (int i = 0; i < contours.size(); i++) {
            Mat c = contours.get(i);
            double area = contourArea(c);
            areas.add(area);
        }
        if (areas.isEmpty()) {
            return false;
        }
        Double d = Collections.max(areas);
        return d > 40000;
    }
    private static int max(int a, int b) {
        if (a >= b) {
            return a;
        }
        return b;
    }
    //---------------------------------------------------------------------------
    static void display(Mat image, String caption) {
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