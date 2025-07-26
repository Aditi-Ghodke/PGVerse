package com.pgverse.controller;

import com.pgverse.dto.JwtRequest;
import com.pgverse.dto.JwtResponse;
import com.pgverse.security.JwtService;
import com.pgverse.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

//@RestController
//@RequestMapping("/auth")
//@RequiredArgsConstructor
//public class AuthController {
//
//    @Autowired
//    private final AuthenticationManager authManager;
//
//    @Autowired
//    private final JwtService jwtService;
//
//    @Autowired
//    private final CustomUserDetailsService userDetailsService;
//
//    
//    //------------USER--------------
//    
//    
//    @PostMapping("/login")
//    public JwtResponse login(@RequestBody JwtRequest request) {
//        authManager.authenticate(new UsernamePasswordAuthenticationToken(
//                request.getEmail(), request.getPassword()));
//
//        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
//        final String token = jwtService.generateToken(userDetails);
//        return new JwtResponse(token); 
//    }
//    
//    //------------OWNER--------------
//    
//    @PostMapping("/owner/login")
//    public JwtResponse ownerLogin(@RequestBody JwtRequest request) {
//        authManager.authenticate(new UsernamePasswordAuthenticationToken(
//                request.getEmail(), request.getPassword()));
//
//        UserDetails ownerDetails = userDetailsService.loadOwnerByEmail(request.getEmail());
//        String token = jwtService.generateToken(ownerDetails);
//        return new JwtResponse(token);
//    }
//
//    //------------ADMIN--------------
//    
//    @PostMapping("/admin/login")
//    public JwtResponse adminLogin(@RequestBody JwtRequest request) {
//        authManager.authenticate(new UsernamePasswordAuthenticationToken(
//                request.getEmail(), request.getPassword()));
//
//        UserDetails adminDetails = userDetailsService.loadAdminByEmail(request.getEmail());
//        String token = jwtService.generateToken(adminDetails);
//        return new JwtResponse(token);
//    }
//}

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @PostMapping("/login")
    public JwtResponse login(@RequestBody JwtRequest request) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword()));

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String token = jwtService.generateToken(userDetails);
        return new JwtResponse(token);
    }
}

