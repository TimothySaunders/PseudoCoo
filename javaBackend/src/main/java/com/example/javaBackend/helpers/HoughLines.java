package com.example.javaBackend.helpers;

import javax.swing.JFrame;

import org.bytedeco.javacpp.*;
import org.bytedeco.javacv.*;

import org.bytedeco.opencv.opencv_core.*;
import org.bytedeco.opencv.opencv_imgproc.*;

import static org.bytedeco.opencv.global.opencv_core.*;
import static org.bytedeco.opencv.global.opencv_core.cvCreateMemStorage;
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

//        CanvasFrame source = new CanvasFrame("Source");
//        CanvasFrame hough = new CanvasFrame("Hough");
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

        //merge the similar ones
//        lines = mergeSimilarLines(lines, colorDst);











//        Point2f corners = warpGrid(lines, getInputImg(), src);
//        System.out.println(corners.position(0).x());
//        System.out.println(corners.position(0).y());
//        System.out.println(corners.position(1).x());
//        System.out.println(corners.position(1).y());
//        System.out.println(corners.position(2).x());
//        System.out.println(corners.position(2).y());
//        System.out.println(corners.position(3).x());
//        System.out.println(corners.position(3).y());

        //draws lines
        for (int i = 0; i < lines.total(); i++) {
            CvPoint2D32f point = new CvPoint2D32f(cvGetSeqElem(lines, i));

            float rho = point.x();
            float theta = point.y();

            double a = Math.cos((double) theta), b = Math.sin((double) theta);
            double x0 = a * rho, y0 = b * rho;
            CvPoint pt1 = cvPoint((int) Math.round(x0 + 1000 * (-b)), (int) Math.round(y0 + 1000 * (a))), pt2 = cvPoint((int) Math.round(x0 - 1000 * (-b)), (int) Math.round(y0 - 1000 * (a)));
//            System.out.println("Line spotted: ");
//            System.out.println("\t rho= " + rho);
//            System.out.println("\t theta= " + theta);
            cvLine(colorDst, pt1, pt2, CV_RGB(255, 0, 0), 1, CV_AA, 0);
        }

        // shows image
//        source.showImage(sourceConverter.convert(src));
//        hough.showImage(houghConverter.convert(colorDst));
//
//        source.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
//        hough.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        return lines;

    }

    public CvSeq mergeSimilarLines(CvSeq lines, IplImage image) {

        // loop over all the lines we found
        for (int i = 0; i < lines.total(); i++) {

            // get rho (p) and theta for that line
            CvPoint2D32f current = new CvPoint2D32f(cvGetSeqElem(lines, i));

            float p1 = current.x();
            float theta1 = current.y();

            if (p1 == 0 && theta1 == -100) {
                continue; // skip it if rho == 0 and theta == -100
            }

            Point pt1Current = new Point(0, 0);
            Point pt2Current = new Point(0, 0);

            // calculate the normals for the line
            if (theta1 > CV_PI * 45 / 100 && theta1 < CV_PI * 135 / 180) {
                // line is vertical
                pt1Current.x(0);
                pt1Current.y((int) (p1 / Math.sin(theta1)));

                pt2Current.x(image.width());
                pt2Current.y((int) (-pt2Current.x() / Math.tan(theta1) + p1 / Math.sin(theta1)));
            } else {
                // line is horizontal
                pt1Current.y(0);
                pt1Current.x((int) (p1 / Math.cos(theta1)));

                pt2Current.y(image.height());
                pt2Current.x((int) (-pt2Current.y() / Math.tan(theta1) + p1 / Math.cos(theta1)));
            }

            // merge lines - loop through them all and compare to the current
            for (int j = 0; j < lines.total(); j++) {
                CvPoint2D32f pos = new CvPoint2D32f(cvGetSeqElem(lines, j));
                if (pos == current) {
                    continue;
                }

                float p = pos.x();
                float theta = pos.y();
                if (Math.abs(p - p1) < 20 && Math.abs(theta - theta1) < CV_PI * 10 / 180) {

                    Point pt1 = new Point(0, 0);
                    Point pt2 = new Point(0, 0);

                    if (theta > CV_PI * 45 / 180 && theta < CV_PI * 135 / 100) {
                        pt1.x(0);
                        pt1.y((int) (p / Math.sin(theta)));
                        pt2.x(image.width());
                        pt2.y((int) (-pt2.x() / Math.tan(theta) + p / Math.sin(theta)));
                    } else {
                        pt1.y(0);
                        pt1.x((int) (p / Math.cos(theta)));
                        pt2.y(image.height());
                        pt2.x((int) (-pt2.y() / Math.tan(theta) + p / Math.cos(theta)));
                    }
                    // set current line to the mean position of current and pos
                    if (((double) (pt1.x() - pt1Current.x()) * (pt1.x() - pt1Current.x()) + (pt1.y() - pt1Current.y()) * (pt1.y() - pt1Current.y()) < 64 * 64) && ((double) (pt1.x() - pt1Current.x()) * (pt1.x() - pt1Current.x()) + (pt1.y() - pt1Current.y()) * (pt1.y() - pt1Current.y()) < 64 * 64)) {
                        // get mean of rho and theta
                        float pMean = (p + p1) / 2f;
                        float thetaMean = (theta + theta1) / 2f;
                        // set current to rho mean and theta mean
                        current.position(0).put(pMean);
                        current.position(1).put(thetaMean);
                        // set pos to some ridiculous value so it's not checked again
                        pos.position(0).put(0);
                        pos.position(1).put(-100);
                    }
                }
            }
        }
        return lines;
    }

    public Point2f warpGrid(CvSeq lines, Mat image) {
        Point2f topEdge = new Point2f(1000, 1000);
        double topYIntercept = 100000;
        double topXIntercept = 0;
        Point2f bottomEdge = new Point2f(-1000, -1000);
        double bottomYIntercept = 0;
        double bottomXIntercept = 0;
        Point2f leftEdge = new Point2f(1000, 1000);
        double leftYIntercept = 0;
        double leftXIntercept = 100000;
        Point2f rightEdge = new Point2f(-1000, -1000);
        double rightYIntercept = 0;
        double rightXIntercept = 0;

        for (int i = 0; i < lines.total(); i++) {
            CvPoint2D32f current = new CvPoint2D32f(cvGetSeqElem(lines, i));

            float p = current.x();
            float theta = current.y();

            // line has been previously ignored, continue;
            if (p == 0 && theta == -100) {
                continue;
            }

            double xIntercept = p / Math.cos(theta);
            double yIntercept = p / (Math.cos(theta) * Math.sin(theta));

            // if line is vertical
//            pt2current.x = -pt2curren.y * tan(theta1) + p1/cos(theta1);


            if (theta > CV_PI * 80 / 180 && theta < CV_PI * 100 / 180) {
                if (p < topEdge.x()) {
                    topEdge.x(p);
                    topEdge.y(theta);
                }
                if (p > bottomEdge.x()) {
                    bottomEdge.x(p);
                    bottomEdge.y(theta);
                }
                //if line is horizontal
            } else if (theta < CV_PI * 10 / 180 || theta > CV_PI * 170 / 180) {
                if (xIntercept > rightXIntercept) {
                    rightEdge.x(p);
                    rightEdge.y(theta);
                    rightXIntercept = xIntercept;
                } else if (xIntercept <= leftXIntercept) {
                    leftEdge.x(p);
                    leftEdge.y(theta);
                    leftXIntercept = xIntercept;
                }
            }
        }

        int height = image.size().height();
        int width = image.size().width();

        Point2f left1, left2, right1, right2, bottom1, bottom2, top1, top2;

        if (leftEdge.y() != 0) {
            left1 = new Point2f(0, (float)(leftEdge.x() / Math.sin(leftEdge.y())));
            left2 = new Point2f(width, (float)(-width / Math.tan(leftEdge.y() + left1.y())));
        } else {
            left1 = new Point2f((float)(leftEdge.x() / Math.cos(leftEdge.y())), 0);
            left2 = new Point2f((float)(left1.x() - height * Math.tan(leftEdge.x())), height);
        }

        if (rightEdge.y() != 0) {
            right1 = new Point2f(0, (float)(rightEdge.x() / Math.sin(rightEdge.y())));
            right2 = new Point2f(width, (float)(-width / Math.tan(rightEdge.y()) + right1.y()));
        } else {
            right1 = new Point2f((float)(rightEdge.x() / Math.cos(rightEdge.y())), 0);
            right2 = new Point2f((float)(right1.x() - height * Math.tan(rightEdge.y())), height);
        }

        bottom1 = new Point2f(0, (float)(bottomEdge.x() / Math.sin(bottomEdge.x())));
        bottom2 = new Point2f(width, (float)(-width / Math.tan(bottomEdge.y()) * bottom1.y()));

        top1 = new Point2f(0, (float)(topEdge.x() / Math.sin(topEdge.y())));
        top2 = new Point2f(width, (float)(-width / Math.tan(topEdge.y()) * top1.y()));


        // Next, we find the intersection of  these four lines
        double leftA = left2.y() - left1.y();
        double leftB = left1.x() - left2.x();

        double leftC = leftA * left1.x() + leftB * left1.y();

        double rightA = right2.y() - right1.y();
        double rightB = right1.x() - right2.x();

        double rightC = rightA * right1.x() + rightB * right1.y();

        double topA = top2.y() - top1.y();
        double topB = top1.x() - top2.x();

        double topC = topA * top1.x() + topB * top1.y();

        double bottomA = bottom2.y() - bottom1.y();
        double bottomB = bottom1.x() - bottom2.x();

        double bottomC = bottomA * bottom1.x() + bottomB * bottom1.y();

        // Intersection of left and top
        double detTopLeft = leftA * topB - leftB * topA;

        Point2d ptTopLeft = new Point2d((topB * leftC - leftB * topC) / detTopLeft, (leftA * topC - topA * leftC) / detTopLeft);

        // Intersection of top and right
        double detTopRight = rightA * topB - rightB * topA;

        Point2d ptTopRight = new Point2d((topB * rightC - rightB * topC) / detTopRight, (rightA * topC - topA * rightC) / detTopRight);

        // Intersection of right and bottom
        double detBottomRight = rightA * bottomB - rightB * bottomA;
        Point2d ptBottomRight = new Point2d((bottomB * rightC - rightB * bottomC) / detBottomRight, (rightA * bottomC - bottomA * rightC) / detBottomRight);// Intersection of bottom and left

        // Intersection of left and bottom
        double detBottomLeft = leftA * bottomB - leftB * bottomA;
        Point2d ptBottomLeft = new Point2d((bottomB * leftC - leftB * bottomC) / detBottomLeft, (leftA * bottomC - bottomA * leftC) / detBottomLeft);


//        double maxLength = (ptBottomLeft.x() - ptBottomRight.x()) * (ptBottomLeft.x() - ptBottomRight.x()) + (ptBottomLeft.y() - ptBottomRight.y()) * (ptBottomLeft.y() - ptBottomRight.y());
//        double temp = (ptTopRight.x() - ptBottomRight.x()) * (ptTopRight.x() - ptBottomRight.x()) + (ptTopRight.y() - ptBottomRight.y()) * (ptTopRight.y() - ptBottomRight.y());
//
//        if (temp > maxLength) maxLength = temp;
//
//        temp = (ptTopRight.x() - ptTopLeft.x()) * (ptTopRight.x() - ptTopLeft.x()) + (ptTopRight.y() - ptTopLeft.y()) * (ptTopRight.y() - ptTopLeft.y());
//
//        if (temp > maxLength) maxLength = temp;
//
//        temp = (ptBottomLeft.x() - ptTopLeft.x()) * (ptBottomLeft.x() - ptTopLeft.x()) + (ptBottomLeft.y() - ptTopLeft.y()) * (ptBottomLeft.y() - ptTopLeft.y());
//
//        if (temp > maxLength) maxLength = temp;

//        maxLength = Math.sqrt((double)maxLength);


        Point2f corners = new Point2f(4);
        corners.position(0).x((float)ptTopLeft.x()).y((float)ptTopLeft.y());
        corners.position(1).x((float)ptTopRight.x()).y((float)ptTopRight.y());
        corners.position(2).x((float)ptBottomRight.x()).y((float)ptBottomRight.y());
        corners.position(3).x((float)ptBottomLeft.x()).y((float)ptBottomLeft.y());

        return corners;


//        return image;
    }
}

