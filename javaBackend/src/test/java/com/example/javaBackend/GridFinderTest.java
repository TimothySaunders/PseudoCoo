package com.example.javaBackend;

import com.example.javaBackend.models.GridFinder;
import org.junit.Before;
import org.junit.Test;

import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;

public class GridFinderTest {

    private GridFinder grid;

    @Before
    public void before() {
        grid = new GridFinder("images/sudoku4.jpg");
    }

    @Test
    public void canConvert() throws InterruptedException {
        grid.testConvert();
        TimeUnit.SECONDS.sleep(30);
    }
}
