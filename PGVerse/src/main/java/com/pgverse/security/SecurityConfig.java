package com.pgverse.security;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import com.pgverse.entities.User;

@Configuration
public class SecurityConfig {

    private final ModelMapper modelMapper;

    SecurityConfig(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

	   @Bean
	    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	        http
	            .csrf(csrf -> csrf.disable()) // disable CSRF for APIs
	            .authorizeHttpRequests(auth -> auth
	                .requestMatchers(
	                		"swagger-ui/**",
	                		"swagger-ui.html",
	                		"/v3/api-docs/**",
	                        "/v3/api-docs",
	                        "/swagger-resources/**",
	                		"/users/signin",
	                		"/webjars/**"
	                		
	                		) 
	                .permitAll() 
	                .anyRequest().authenticated()                // protect everything else
	            );
	        return http.build();
	    }
	   
	
	  
}
