package com.codeclan.example.backend.model;

import javax.persistence.*;

@Entity
@Table(name="games")
public class SaveGame {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String gridValues;

    public SaveGame() {
    }

    public SaveGame(String gridValues) {
        this.gridValues = gridValues;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGridValues() {
        return gridValues;
    }

    public void setGridValues(String gridValues) {
        this.gridValues = gridValues;
    }
}
