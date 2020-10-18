package com.example.javaBackend.models;

import javax.persistence.*;

@Entity
@Table(name="cowJokes")
public class CowJoke {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="setup", length=1024)
    private String setup;

    @Column(name="puchline")
    private String punchline;

    public CowJoke() {
    }

    public CowJoke(String setup, String punchline) {
        this.setup = setup;
        this.punchline = punchline;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSetup() {
        return setup;
    }

    public void setSetup(String setup) {
        this.setup = setup;
    }

    public String getPunchline() {
        return punchline;
    }

    public void setPunchline(String punchline) {
        this.punchline = punchline;
    }
}
