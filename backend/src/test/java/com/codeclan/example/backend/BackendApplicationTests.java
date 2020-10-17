package com.codeclan.example.backend;

import com.codeclan.example.backend.repositories.SaveGameRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BackendApplicationTests {

	@Autowired
	SaveGameRepository saveGameRepository;

	@Test
	void contextLoads() {
	}

}
