package com.futureschool;

import com.futureschool.application.FutureSchoolApplication;
import com.futureschool.common.exception.ResourceNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = FutureSchoolApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(GlobalExceptionHandlerTest.TestErrorController.class)
class GlobalExceptionHandlerTest {

    @RestController
    static class TestErrorController {
        @GetMapping("/api/v1/test-error/not-found")
        public void throwNotFound() {
            throw new ResourceNotFoundException("Student", "GVS-2027-9999");
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser
    @DisplayName("ResourceNotFoundException renders RFC 7807 compliant JSON without stack trace")
    void testResourceNotFoundJsonSchema() throws Exception {
        mockMvc.perform(get("/api/v1/test-error/not-found")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.code").value("RESOURCE_NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("Student with identifier 'GVS-2027-9999' was not found"))
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.requestId").exists())
                .andExpect(jsonPath("$.stackTrace").doesNotExist());
    }
}
