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
import org.springframework.dao.DataIntegrityViolationException;

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
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // 1. Normalizamos el email para que no importen las mayúsculas
            String emailLimpio = loginRequest.getEmail().trim().toLowerCase();

            // 2. Creamos el token con el email ya normalizado
            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                    emailLimpio,
                    loginRequest.getPassword()
            );

            authenticationManager.authenticate(token);
            return ResponseEntity.ok("Has iniciado correctamente la sesión");

        } catch (Exception e) {
            // Si falla, el usuario no sabrá si fue el email o la pass (mejor seguridad)
            return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            alumnoService.crearAlumno(request);
            return ResponseEntity.ok("Registro completado con éxito");
        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno del servidor");
        }
    }
}