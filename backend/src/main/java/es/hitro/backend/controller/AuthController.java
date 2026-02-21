package es.hitro.backend.controller;

import es.hitro.backend.dto.LoginRequest;
import es.hitro.backend.dto.RegisterRequest;
import es.hitro.backend.service.AlumnoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AlumnoService alumnoService;

    public AuthController(AuthenticationManager authenticationManager, AlumnoService alumnoService) {
        this.authenticationManager = authenticationManager;
        this.alumnoService = alumnoService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login (@RequestBody LoginRequest loginRequest) {
        try {
            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword());
            authenticationManager.authenticate(token);
            return ResponseEntity.ok("Has iniciado correctamente la sesion");

        }catch (Exception e) {
            return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            alumnoService.crearAlumno(registerRequest);
            return ResponseEntity.ok("Usuario registrado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error en el registro: " + e.getMessage());
        }
    }
}
