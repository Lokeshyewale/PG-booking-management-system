package com.pgbooking.web;

import com.pgbooking.model.Role;
import com.pgbooking.model.User;
import com.pgbooking.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        try {
            String name     = body.get("name");
            String email    = body.get("email");
            String password = body.get("password");
            String roleStr  = body.getOrDefault("role", "USER");

            Role role;
            try { role = Role.valueOf(roleStr.toUpperCase()); }
            catch (IllegalArgumentException e) { role = Role.USER; }

            User user = authService.signup(name, email, password, role);
            String token = authService.login(email, password);

            return ResponseEntity.ok(Map.of(
                "message", "Account created successfully",
                "data", Map.of(
                    "id",    user.getId(),
                    "name",  user.getName(),
                    "email", user.getEmail(),
                    "role",  user.getRole().name(),
                    "token", token
                )
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String email    = body.get("email");
            String password = body.get("password");
            String token    = authService.login(email, password);
            User   user     = authService.findByEmail(email);

            return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "data", Map.of(
                    "id",    user.getId(),
                    "name",  user.getName(),
                    "email", user.getEmail(),
                    "role",  user.getRole().name(),
                    "token", token
                )
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }
}