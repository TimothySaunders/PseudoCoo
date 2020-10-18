package com.example.javaBackend.helpers;

import javax.swing.JFrame;

import org.bytedeco.javacpp.*;
import org.bytedeco.javacv.*;

import org.bytedeco.opencv.opencv_core.*;
import org.bytedeco.opencv.opencv_imgproc.*;

import static org.bytedeco.opencv.global.opencv_core.*;
import static org.bytedeco.opencv.global.opencv_imgproc.*;
import static org.bytedeco.opencv.global.opencv_imgcodecs.*;

/**
 * C to Java translation of the houghlines.c sample provided in the c sample directory of OpenCV 2.1,
 * using the JavaCV Java wrapper of OpenCV 2.2 developped by Samuel Audet.
 *
 * @author Jeremy Nicola
 * jeremy.nicola@gmail.com
 */
public class HoughLines {

    private Mat inputImg;

    public HoughLines(Mat inputImg) {
        this.inputImg = inputImg;
    }

    public Mat getInputImg() {
        return inputImg;
    }

    public static IplImage toIplImage(Mat src) {
        OpenCVFrameConverter.ToIplImage iplConverter = new OpenCVFrameConverter.ToIplImage();
        OpenCVFrameConverter.ToMat matConverter = new OpenCVFrameConverter.ToMat();
        Frame frame = matConverter.convert(src);
        IplImage img = iplConverter.convert(frame);
        IplImage result = img.clone();
        img.release();
        return result;
    }

    public CvSeq lines() {
        IplImage src = toIplImage(getInputImg());
        IplImage dst;
        IplImage colorDst;
        CvMemStorage storage = cvCreateMemStorage(0);
        CvSeq lines = new CvSeq();

        CanvasFrame source = new CanvasFrame("Source");
        CanvasFrame hough = new CanvasFrame("Hough");
        OpenCVFrameConverter.ToIplImage sourceConverter = new OpenCVFrameConverter.ToIplImage();
        OpenCVFrameConverter.ToIplImage houghConverter = new OpenCVFrameConverter.ToIplImage();
        if (src == null) {
            System.out.println("Couldn't load source image.");
            return new CvSeq();
        }
        CvSize sz = cvSize(getInputImg().cols(), getInputImg().rows());
//        System.out.println(src.depth());
        dst = cvCreateImage(sz, IPL_DEPTH_8U, 1);
        colorDst = cvCreateImage(sz, IPL_DEPTH_8U, 3);

        cvCanny(src, dst, 50, 200, 3);
        cvCvtColor(dst, colorDst, CV_GRAY2BGR);

        System.out.println("Using the Standard Hough Transform");
        lines = cvHoughLines2(dst, storage, CV_HOUGH_STANDARD, 1, Math.PI / 180, 90, 0, 0, 0, CV_PI);

        lines = mergeSimilarLines(lines, colorDst);

        for (int i = 0; i < lines.total(); i++) {
            CvPoint2D32f point = new CvPoint2D32f(cvGetSeqElem(lines, i));

            float rho = point.x();
            float theta = point.y();

            double a = Math.cos((double) theta), b = Math.sin((double) theta);
            double x0 = a * rho, y0 = b * rho;
            CvPoint pt1 = cvPoint((int) Math.round(x0 + 1000 * (-b)), (int) Math.round(y0 + 1000 * (a))), pt2 = cvPoint((int) Math.round(x0 - 1000 * (-b)), (int) Math.round(y0 - 1000 * (a)));
            System.out.println("Line spotted: ");
            System.out.println("\t rho= " + rho);
            System.out.println("\t theta= " + theta);
            cvLine(colorDst, pt1, pt2, CV_RGB(255, 0, 0), 1, CV_AA, 0);
        }

        source.showImage(sourceConverter.convert(src));
        hough.showImage(houghConverter.convert(colorDst));

        source.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        hough.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        return lines;

    }

    public CvSeq mergeSimilarLines(CvSeq lines, IplImage image) {
        for (int i = 0; i < lines.total(); i++) {

            CvPoint2D32f current = new CvPoint2D32f(cvGetSeqElem(lines, i));
            CvPoint p1  = new CvPoint(current).position(0);
            CvPoint theta1  = new CvPoint(current).position(1);

            if (p1.get() == 0 && theta1.get() == -100) {
                continue;
            }

            Point pt1Current = new Point(0, 0);
            Point pt2Current = new Point(0, 0);

            if (theta1.get() > CV_PI * 45 / 100 && theta1.get() < CV_PI * 135 / 180) {
                pt1Current.x(0);
                pt1Current.y((int) (p1.get() / Math.sin(theta1.get())));

                pt2Current.x(image.width());
                pt2Current.y((int) (-pt2Current.x() / Math.tan(theta1.get()) + p1.get() / Math.sin(theta1.get())));
            } else {
                pt1Current.y(0);
                pt1Current.x((int) (p1.get() / Math.cos(theta1.get())));

                pt2Current.y(image.height());
                pt2Current.x((int) (-pt2Current.y() / Math.tan(theta1.get()) + p1.get() / Math.cos(theta1.get())));
            }

            for (int j = 0; j < lines.total(); j++) {
                CvPoint2D32f pos = new CvPoint2D32f(cvGetSeqElem(lines, j));
                if (pos == current) {
                    continue;
                }

                CvPoint p  = new CvPoint(pos).position(0);
                CvPoint theta  = new CvPoint(pos).position(1);
                if (Math.abs(p.get() - p1.get()) < 20 && Math.abs(theta.get() - theta1.get()) < CV_PI * 10 / 180) {

                    Point pt1 = new Point(0, 0);
                    Point pt2 = new Point(0, 0);

                    if (theta.get() > CV_PI * 45 / 180 && theta.get() < CV_PI * 135 / 100) {
                        pt1.x(0);
                        pt1.y((int)(p.get() / Math.sin(theta.get())));
                        pt2.x(image.width());
                        pt2.y((int)(-pt2.x() / Math.tan(theta.get()) + p.get() / Math.sin(theta.get())));
                    } else {
                        pt1.y(0);
                        pt1.x((int)(p.get() / Math.cos(theta.get())));
                        pt2.y(image.height());
                        pt2.x((int)(-pt2.y() / Math.tan(theta.get()) + p.get() / Math.cos(theta.get())));
                    }

                    if (((double)(pt1.x() - pt1Current.x()) * (pt1.x() - pt1Current.x()) + (pt1.y() - pt1Current.y()) * (pt1.y() - pt1Current.y()) < 64 * 64) && ((double)(pt1.x() - pt1Current.x()) * (pt1.x() - pt1Current.x()) + (pt1.y() - pt1Current.y()) * (pt1.y() - pt1Current.y()) < 64 * 64)) {
                        float pMean = (p.get() + p1.get()) / 2f;
                        float thetaMean = (theta.get() + theta1.get()) / 2f;
                        cvGetSeqElem(lines, i).position(0).put((byte) pMean);
                        cvGetSeqElem(lines, i).position(1).put((byte) thetaMean);

                        cvGetSeqElem(lines, j).position(0).put((byte) 0);
                        cvGetSeqElem(lines, j).position(1).put((byte) -100);
                    }
                }
            }
        }
    return lines;
    }
}

