package com.furryfeast.service;

import com.furryfeast.dto.auth.LoginRequestDTO;
import com.furryfeast.dto.auth.LoginResponseDTO;
import com.furryfeast.model.Usuario;
import com.furryfeast.repository.UsuarioRepository;
import com.furryfeast.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UsuarioRepository usuarioRepository;

    public AuthService(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider, UsuarioRepository usuarioRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.usuarioRepository = usuarioRepository;
    }

    public LoginResponseDTO login(LoginRequestDTO request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + request.getEmail()));

        return LoginResponseDTO.builder()
                .token(token)
                .user(LoginResponseDTO.UserDetailsDTO.builder()
                        .id(usuario.getId())
                        .email(usuario.getEmail())
                        .role(usuario.getRole())
                        .nombre(usuario.getNombre())
                        .cedula(usuario.getCedula())
                        .build())
                .build();
    }
}
