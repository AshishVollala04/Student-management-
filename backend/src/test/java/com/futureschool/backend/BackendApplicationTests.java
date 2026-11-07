package com.futureschool.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BackendApplicationTests {

	@org.springframework.beans.factory.annotation.Autowired
	private com.futureschool.backend.security.JwtUtil jwtUtil;

	@Test
	void testJwtGenerationAndValidation() {
		String token = jwtUtil.generateToken("STU0001", "student", "Aarav Verma");
		System.out.println("Generated token: " + token);
		String extracted = jwtUtil.extractLoginId(token);
		System.out.println("Extracted loginId: " + extracted);
		org.junit.jupiter.api.Assertions.assertEquals("STU0001", extracted);
		org.junit.jupiter.api.Assertions.assertTrue(jwtUtil.validateToken(token, "STU0001"));
	}

}

