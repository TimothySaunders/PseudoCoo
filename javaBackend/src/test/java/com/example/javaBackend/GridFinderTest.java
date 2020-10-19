package com.example.javaBackend;

import com.example.javaBackend.helpers.HoughLines;
import com.example.javaBackend.models.GridFinder;
import org.bytedeco.opencv.opencv_core.Mat;
import org.junit.Before;
import org.junit.Test;

import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;

public class GridFinderTest {

    private GridFinder grid;

    @Before
    public void before() {
        grid = new GridFinder("images/sudoku.jpg");
    }

    @Test
    public void canConvert() throws InterruptedException {
        grid.testConvert();
        TimeUnit.SECONDS.sleep(30);
    }

    @Test
    public void canDoHoughLines() throws InterruptedException {
        Mat output = grid.testConvert();
//        HoughLines hl = new HoughLines(output);
//        hl.lines();
        TimeUnit.SECONDS.sleep(30);
    }
}
