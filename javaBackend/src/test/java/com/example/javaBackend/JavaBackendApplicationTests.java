package com.example.javaBackend;

import com.example.javaBackend.models.SaveGame;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;

@SpringBootTest
class JavaBackendApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void canSetTimeStamp(){
		SaveGame saveGame = new SaveGame("0123", "18/10/20");
		System.out.println(saveGame.getTimeStamp());
	}

}
