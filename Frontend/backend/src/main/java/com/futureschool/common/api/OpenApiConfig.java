package com.futureschool.common.api;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI 3.0 configuration documenting foundational endpoints.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI futureSchoolOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FutureSchool Backend API")
                        .description("FutureSchool Multi-Tenant SaaS Platform REST API (Phase 15 Foundation)")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("FutureSchool Engineering")
                                .email("dev@futureschool.example.com"))
                        .license(new License()
                                .name("Proprietary")
                                .url("https://futureschool.example.com")));
    }
}
