//package com.pgverse.security;
//
//import java.util.Collections;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import com.pgverse.dao.AdminDao;
//import com.pgverse.dao.OwnerDao;
//import com.pgverse.dao.UserDao;
//import com.pgverse.entities.Admin;
//import com.pgverse.entities.Owner;
//import com.pgverse.entities.User;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//public class CustomUserDetailsService implements UserDetailsService {
//
//    @Autowired
//    private final UserDao userDao;
//    private final OwnerDao ownerDao;
//    private final AdminDao adminDao;
//
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        User user = userDao.findByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
//
//        return new org.springframework.security.core.userdetails.User(
//                user.getEmail(),
//                user.getPassword(),
//                Collections.singletonList(() -> "ROLE_" + user.getRole().name())
//        );
//    }
//    
//    
//    public UserDetails loadOwnerByEmail(String email) {
//        Owner owner = ownerDao.findByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("Owner not found"));
//        return new CustomUserDetails(owner.getEmail(), owner.getPassword(), "ROLE_OWNER");
//    }
//
//    public UserDetails loadAdminByEmail(String email) {
//        Admin admin = adminDao.findByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("Admin not found"));
//        return new CustomUserDetails(admin.getEmail(), admin.getPassword(), "ROLE_ADMIN");
//    }
//}


package com.pgverse.security;

import com.pgverse.dao.AdminDao;
import com.pgverse.dao.OwnerDao;
import com.pgverse.dao.UserDao;
import com.pgverse.entities.Admin;
import com.pgverse.entities.Owner;
import com.pgverse.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

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
}

