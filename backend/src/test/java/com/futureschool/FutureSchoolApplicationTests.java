package com.futureschool;

import com.futureschool.application.FutureSchoolApplication;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(classes = FutureSchoolApplication.class)
@ActiveProfiles("test")
class FutureSchoolApplicationTests {

    @Test
    @DisplayName("Application Context Loads Successfully")
    void contextLoads() {
        assertNotNull(FutureSchoolApplication.class);
    }
}
