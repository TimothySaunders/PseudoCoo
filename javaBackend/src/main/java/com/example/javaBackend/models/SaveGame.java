package com.example.javaBackend.models;

import javax.persistence.*;

@Entity
@Table(name="games")
public class SaveGame {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="grid_values", length=1024)
    private String gridValues;

    @Column(name="timestamp")
    private String timeStamp;

    public SaveGame() {
    }

    public SaveGame(String gridValues, String timeStamp) {
        this.gridValues = gridValues;
        this.timeStamp = timeStamp;
    }

    public String getGridValues() {
        return gridValues;
    }

    public void setGridValues(String gridValues) {
        this.gridValues = gridValues;
    }

    public String getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(String timeStamp) {
        this.timeStamp = timeStamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
