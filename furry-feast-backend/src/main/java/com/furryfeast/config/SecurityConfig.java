package com.furryfeast.config;

import com.furryfeast.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilitar CSRF para APIs sin estado
            .csrf(AbstractHttpConfigurer::disable)
            
            // Habilitar frameOptions para consola de H2
            .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
            
            // Configurar políticas de sesión sin estado
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Configurar autorizaciones de endpoints
            .authorizeHttpRequests(auth -> auth
                // Rutas Públicas
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                
                // Rutas que requieren ROLE_ADMIN
                .requestMatchers("/api/ventas").hasRole("ADMIN")
                .requestMatchers("/api/productos/alertas").authenticated() // Alertas de stock bajo
                .requestMatchers("/api/productos/{id}/desactivar").hasRole("ADMIN")
                .requestMatchers("/api/productos/{id}").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/productos").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/productos/**").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/productos/**").hasRole("ADMIN")
                
                // Rutas que requieren estar autenticado (cualquier rol)
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/productos").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/ventas").authenticated()
                
                // Cualquier otra petición requiere autenticación
                .anyRequest().authenticated()
            );

        // Añadir el filtro JWT antes del UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
