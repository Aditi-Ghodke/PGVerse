package com.pgverse.dto;

public class LoginRespDTO {
    private String token;
    public LoginRespDTO(String token) {
        this.token = token;
    }
    public String getToken() {
        return token;
    }
}

