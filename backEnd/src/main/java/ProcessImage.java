import org.bytedeco.javacv.*;

import org.bytedeco.opencv.opencv_core.*;
import org.bytedeco.opencv.opencv_imgproc.Vec4iVector;
import org.bytedeco.opencv.opencv_core.Point;
import javax.swing.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.bytedeco.opencv.global.opencv_core.*;
import static org.bytedeco.opencv.global.opencv_imgproc.*;
import static org.bytedeco.opencv.global.opencv_imgcodecs.*;
public class ProcessImage {

    public static void main(String[] args) {

        // Read an image. (grayscale)
        Mat sudoku = imread("/Users/Jonny/codeclan/week_14_react_&&_project/project/PseudoCoo/backEnd/images/sudoku.jpg", 0);
        // show it
        display(sudoku, "original");

        // create a blank image to put the processed image in
        Mat outerBox = new Mat(sudoku.size(), CV_8UC1);

        // run a gaussian blur to filter out noise
        GaussianBlur(sudoku, sudoku, new Size(11, 11), 0);

        // run adaptive threshold to improve contrast
        adaptiveThreshold(sudoku, outerBox, 255, ADAPTIVE_THRESH_MEAN_C, THRESH_BINARY, 3, 2);

        // invert colours
        bitwise_not(outerBox, outerBox);

        // embiggens edges
        Mat kernel = Mat.ones(3, 3, CV_32F).asMat();
        dilate(outerBox, outerBox, kernel);

        // warp perspective
        outerBox = warpPerspectivePuzzle(outerBox);

        // invert back to black on white
        bitwise_not(outerBox, outerBox);

        // display the processed image
        display(outerBox, "extracted");
        








        // convert to black and white

//        display(bw, "blackwhite");

        //threshold
//        final Mat thresh = new Mat();
//        threshold(bw, thresh, 100, 255, CV_THRESH_BINARY);
//        display(thresh, "threshold");

        System.out.println(isSudokuExist((outerBox)));
        System.out.println(getLargestRect(outerBox));
//        drawContours(sudoku, new MatVector(getLargestRect(thresh)), -1, Scalar.RED);
        Rect crop = getLargestRect(outerBox);
//        Rect crop = new Rect(50, 50, 100, 100);
////        Mat ROI = sudoku.adjustROI(crop.x(), crop.y(), crop.width(), crop.height());
//        Mat ROI = sudoku.submat(crop);
        System.out.println(crop.x());
        System.out.println(crop.y());
        System.out.println(crop.width());
        System.out.println(crop.height());

//        display(ROI, "cropped");


//        getLargestShape(outerBox);



        Mat coloured = new Mat(outerBox);
        // To check if an output argument is null we may call either isNull() or equals(null).
//        MatVector contours = new MatVector();
//        findContours(coloured, contours, CV_RETR_LIST, CV_CHAIN_APPROX_SIMPLE);
//        long n = contours.size();
//        for (long i = 0; i < n; i++) {
//            Mat contour = contours.get(i);
//            Mat points = new Mat();
//            approxPolyDP(contour, points, arcLength(contour, true) * 0.02, true);
//            drawContours(coloured, new MatVector(points), -1, Scalar.CYAN);
//        }
//        display(coloured, "contoured");

//        Rect box = getLargestRect(coloured);
//        System.out.println(box.x());
//        System.out.println(box.y());
//        System.out.println(box.width());
//        System.out.println(box.height());

//        final Mat smooth = new Mat();
//        smooth(thresh, smooth, CV_GAUSSIAN, 7, 7, 0, 0);
//        display(smooth, "smoothed");
//    warpPrespectivePuzzle(thresh);
//        display(thresh, "threahafter");


//        final Mat lap = new Mat();
////        Laplacian(thresh, lap, bw.depth(), 1, 3, 0, BORDER_DEFAULT);
////        display(lap, "laplacian");
//
////        final Mat denoise = new Mat();
////        threshold(bw, denoise, .4, 1.5, CV_THRESH_BINARY);
//        Laplacian(thresh, lap, sudoku.depth(), 1, 3, 0, BORDER_DEFAULT);
//        display(lap, "Laplacian");
    }
    private static Mat warpPerspectiveGrid(Mat image, Point2f corners) {
        image = deskewImage(image);
        Rect rect = getLargestRect(image);
//        Point2f srcPts = new Point2f(4);
//        srcPts.position(0).x((float) rect.x()).y((float) rect.y());
//        srcPts.position(1).x((float) rect.x() + rect.width()).y((float) rect.y());
//        srcPts.position(2).x((float) rect.x() + rect.width()).y((float) rect.y() + rect.height());
//        srcPts.position(3).x((float) rect.x()).y((float) rect.y() + rect.height());

        Point2f dstPts = new Point2f(4);
        dstPts.position(0).x(0).y(0);
        dstPts.position(1).x(600 - 1).y(0);
        dstPts.position(2).x(600 - 1).y(600 - 1);
        dstPts.position(3).x(0).y(600 - 1);

        Mat p = getPerspectiveTransform(corners.position(0), dstPts.position(0));
        Mat img = new Mat(new Size(600, 600), image.type());//image.size()
        warpPerspective(image, img, p, img.size());
        return img;
    }



    private static Mat warpPerspectivePuzzle(Mat image) {
        image = deskewImage(image);
        Rect rect = getLargestRect(image);
        Point2f srcPts = new Point2f(4);
        srcPts.position(0).x((float) rect.x()).y((float) rect.y());
        srcPts.position(1).x((float) rect.x() + rect.width()).y((float) rect.y());
        srcPts.position(2).x((float) rect.x() + rect.width()).y((float) rect.y() + rect.height());
        srcPts.position(3).x((float) rect.x()).y((float) rect.y() + rect.height());

        Point2f dstPts = new Point2f(4);
        dstPts.position(0).x(0).y(0);
        dstPts.position(1).x(600 - 1).y(0);
        dstPts.position(2).x(600 - 1).y(600 - 1);
        dstPts.position(3).x(0).y(600 - 1);

        Mat p = getPerspectiveTransform(srcPts.position(0), dstPts.position(0));
        Mat img = new Mat(new Size(600, 600), image.type());//image.size()
        warpPerspective(image, img, p, img.size());
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
            Mat dst = new Mat(img.size(), img.type());
            warpAffine(img, dst, rot, dst.size(), WARP_INVERSE_MAP | INTER_LINEAR, 0, new Scalar(0, 0, 0, 0));
            return dst;
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

//
//    private static Point2f getLargestShape(Mat image) {
//        List<MatOfPoint> contours = new ArrayList<>();
//        List<org.bytedeco.opencv.opencv_core.Point> points = new ArrayList<>();
////        findContours(img, contours, CV_RETR_LIST, CV_CHAIN_APPROX_SIMPLE, new Point(0, 0));
//        findContours(image, (GpuMatVector) contours, new Mat(image.size(), image.type()), CV_SHAPE_RECT, CHAIN_APPROX_SIMPLE);
////        for (int i = 0; i < contours.size(); i++) {
////            MatOfPoint c = contours.get(i);
////        }
//        int maxIndex;
//        double maxVal = 0;
//        Integer biggestPolygonIndex = getBiggestPolygonIndex(contours);
//        MatOfPoint biggest = contours.get(biggestPolygonIndex);
//
////        for (int i = 0; i < contours.size(); i++) {
////            double area = contourArea(contours.get(i));
////            if (maxVal < area) {
////                maxVal = area;
////                c = contours.get(i);
////            }
////        }
//        return getCornersFromPoints(biggest.toList());
//
////        if (areas.isEmpty() || Collections.max(areas) < 4000) {
////            return new Mat();
////        } else {
////            Double d = Collections.max(areas);
////            System.out.println(contours.get(areas.indexOf(d)).data());
//////            return contours.get(areas.indexOf(d)).arrayData();
////            return new Mat();
////        }
//    }
//    private static Integer getBiggestPolygonIndex(final List<MatOfPoint> contours) {
//        double maxVal = 0;
//        Integer maxValIdx = null;
//        for (int contourIdx = 0; contourIdx < contours.size(); contourIdx++) {
//            double contourArea = contourArea(contours.get(contourIdx));
//            if (maxVal < contourArea) {
//                maxVal = contourArea;
//                maxValIdx = contourIdx;
//            }
//        }
//
//        return maxValIdx;
//    }
//    private static Point2f getCornersFromPoints(final List<Point> points) {
//        int minX = 0;
//        int minY = 0;
//        int maxX = 0;
//        int maxY = 0;
//
//
//        for (Point point : points) {
//            int x = point.x();
//            int y = point.y();
//
//            if (minX == 0 || x < minX) {
//                minX = x;
//            }
//            if (minY == 0 || y < minY) {
//                minY = y;
//            }
//            if (maxX == 0 || x > maxX) {
//                maxX = x;
//            }
//            if (maxY == 0 || y > maxY) {
//                maxY = y;
//            }
//        }
//
////        List<Point> corners = new ArrayList<>(4);
////        corners.add(new Point(minX, minY));
////        corners.add(new Point(minX, maxY));
////        corners.add(new Point(maxX, minY));
////        corners.add(new Point(maxX, maxY));
//
//        Point2f corners = new Point2f(4);
//        corners.position(0).x((float) minX).y((float) minY);
//        corners.position(1).x((float) maxX).y((float) minY);
//        corners.position(2).x((float) maxX).y((float) maxY);
//        corners.position(3).x((float) minX).y((float) maxY);
//
//        return corners;
//    }

//    double maxVal = 0;
//    int maxValIdx = 0;
//for (int contourIdx = 0; contourIdx < contours.size(); contourIdx++)
//    {
//        double contourArea = Imgproc.contourArea(contours.get(contourIdx));
//        if (maxVal < contourArea)
//        {
//            maxVal = contourArea;
//            maxValIdx = contourIdx;
//        }
//    }
//
//Imgproc.drawContours(mRgba, contours, maxValIdx, new Scalar(0,255,0), 5);

//



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


