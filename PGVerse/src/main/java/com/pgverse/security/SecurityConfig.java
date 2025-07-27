//package com.pgverse.security;
//
//import org.modelmapper.ModelMapper;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.provisioning.InMemoryUserDetailsManager;
//import org.springframework.security.web.SecurityFilterChain;
//
//import com.pgverse.entities.User;
//
//@Configuration
//public class SecurityConfig {
//
//    private final ModelMapper modelMapper;
//
//    SecurityConfig(ModelMapper modelMapper) {
//        this.modelMapper = modelMapper;
//    }
//
//	   @Bean
//	    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//	        http
//	            .csrf(csrf -> csrf.disable()) // disable CSRF for APIs
//	            .authorizeHttpRequests(auth -> auth
//	                .requestMatchers(
//	                		"swagger-ui/**",
//	                		"swagger-ui.html",
//	                		"/v3/api-docs/**",
//	                        "/v3/api-docs",
//	                        "/swagger-resources/**",
//	                        "/users/login",
//	                        "/users/change-password",
//	                        "/users/**",
//	                		"/users/signin",
//	                		"/admin/login",
//	                		"/admin/**",
//	                		"/owner/login",
//	                		"/owner/**",
//	                		"/pgproperty/**",
//	                		"/webjars/**"
//	                		
//	                		) 
//	                .permitAll() 
//	                .anyRequest().authenticated()                // protect everything else
//	            );
//	        return http.build();
//	    }
//	   
//	
//	  
//}

package com.pgverse.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()  
                .requestMatchers("/users/register").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/users/**").hasRole("USER")
                .requestMatchers("/owners/**").hasRole("OWNER")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .httpBasic(httpBasic -> httpBasic.disable())   
            .formLogin(formLogin -> formLogin.disable());  // disable default form login page

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
            .userDetailsService(userDetailsService)
            .passwordEncoder(passwordEncoder())
            .and().build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
