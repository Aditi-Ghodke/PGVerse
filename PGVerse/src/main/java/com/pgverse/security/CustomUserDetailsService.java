package com.pgverse.security;

import java.util.Collections;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.pgverse.dao.AdminDao;
import com.pgverse.dao.OwnerDao;
import com.pgverse.dao.UserDao;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserDao userDao;
    private final OwnerDao ownerDao;
    private final AdminDao adminDao;
    
    

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // Try User
        return userDao.findByEmail(email).map(user ->
            new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(() -> "ROLE_USER")
            )
        )
        // Try Owner
        .or(() -> ownerDao.findByEmail(email).map(owner ->
            new org.springframework.security.core.userdetails.User(
                owner.getEmail(),
                owner.getPassword(),
                Collections.singletonList(() -> "ROLE_OWNER")
            )
        ))
        // Try Admin
        .or(() -> adminDao.findByEmail(email).map(admin ->
            new org.springframework.security.core.userdetails.User(
                admin.getEmail(),
                admin.getPassword(),
                Collections.singletonList(() -> "ROLE_ADMIN")
            )
        ))
        // If not found in any table
        .orElseThrow(() -> new UsernameNotFoundException("Email not found in any table: " + email));
    }
    
    public Object loadDomainUserByEmail(String email) {
        return userDao.findByEmail(email)
            .<Object>map(user -> user)
            .orElseGet(() -> ownerDao.findByEmail(email)
                .<Object>map(owner -> owner)
                .orElseGet(() -> adminDao.findByEmail(email)
                    .<Object>map(admin -> admin)
                    .orElseThrow(() -> new UsernameNotFoundException("Email not found in any table: " + email))
                )
            );
    }
}

