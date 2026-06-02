package com.furryfeast.dto.auth;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {
    private String token;
    private UserDetailsDTO user;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserDetailsDTO {
        private Long id;
        private String email;
        private String role;
        private String nombre;
        private String cedula;
    }
}
