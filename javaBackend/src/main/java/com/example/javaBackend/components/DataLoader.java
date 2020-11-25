package com.example.javaBackend.components;

import com.example.javaBackend.models.CowJoke;
import com.example.javaBackend.repositories.CowJokeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements ApplicationRunner {

    @Autowired
    CowJokeRepository cowJokeRepository;

    public void run(ApplicationArguments args){
        CowJoke joke1 = new CowJoke("My cow just wandered into a field of marijuana.", "The steaks have never been so high!");
        CowJoke joke2 = new CowJoke("What do you get from a dwarf cow?", "Condensed milk!");
        CowJoke joke3 = new CowJoke("Why do cows have hooves instead of feet?", "Because they lactose!");
        CowJoke joke4 = new CowJoke("What happens when a cow jumps over a wire fence?", "Udder destruction!");
        CowJoke joke5 = new CowJoke("How do you count cows?", "With a cowculator!");
        CowJoke joke6 = new CowJoke("What do you call a cow that just gave birth?", "De-calf-inated!");
        CowJoke joke7 = new CowJoke("What do you get when a cow is caught in an earthquake?", "You get a milkshake!");
        CowJoke joke8 = new CowJoke("What did the mother cow say to the baby cow?", "It's pasture bed time!");
        CowJoke joke9 = new CowJoke("Why do cows wear bells?", "Because their horns don’t work!");
        CowJoke joke10 = new CowJoke("What do you call a cow with no legs?", "Ground beef!");
        CowJoke joke11 = new CowJoke("Ten cows are lined up in a field - which one is nearest Iraq?", "Coo-eight!");
        CowJoke joke12 = new CowJoke("How d'you spot a cow that's on holiday?", "It's the one with the wee calf!");
        CowJoke joke13 = new CowJoke("What do you call a cow with two legs?", "Lean beef!");
        CowJoke joke14 = new CowJoke("What do you call a sleeping cow?", "A Bull-dozer!");
        CowJoke joke15 = new CowJoke("What do you get if you sit under a cow?", "A pat on the head!");

        cowJokeRepository.save(joke1);
        cowJokeRepository.save(joke2);
        cowJokeRepository.save(joke3);
        cowJokeRepository.save(joke4);
        cowJokeRepository.save(joke5);
        cowJokeRepository.save(joke6);
        cowJokeRepository.save(joke7);
        cowJokeRepository.save(joke8);
        cowJokeRepository.save(joke9);
        cowJokeRepository.save(joke10);
        cowJokeRepository.save(joke11);
        cowJokeRepository.save(joke12);
        cowJokeRepository.save(joke13);
        cowJokeRepository.save(joke14);
        cowJokeRepository.save(joke15);
    }

}
