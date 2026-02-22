package es.hitro.backend.service;

import es.hitro.backend.entity.Alumno;
import es.hitro.backend.repository.AlumnoRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AlumnoService {
    private final PasswordEncoder passwordEncoder;
    private final AlumnoRepository alumnoRepository;


    public AlumnoService(PasswordEncoder passwordEncoder, AlumnoRepository alumnoRepository) {
        this.passwordEncoder = passwordEncoder;
        this.alumnoRepository = alumnoRepository;
    }

    public Alumno encriptarContrasenia(Alumno alumno) {

        String passwordEncriptada = passwordEncoder.encode(alumno.getPassword());


        alumno.setPassword(passwordEncriptada);

        alumnoRepository.save(alumno);
        return alumno;

    }

    public Alumno crearAlumno(es.hitro.backend.dto.RegisterRequest registerRequest) {

        String emailLimp= registerRequest.getEmail().toLowerCase().trim();
        String TelefonoLimp= registerRequest.getTelefono().trim();

        if (alumnoRepository.existsByEmail(emailLimp)) {
            throw new IllegalArgumentException("El email ya ha sido registrado");

        }
        if (alumnoRepository.existsByTelefono(TelefonoLimp)) {
            throw new IllegalArgumentException("El telefono ya ha sido registrado");
        }

        String passwordEncriptada = passwordEncoder.encode(registerRequest.getPassword());
        Alumno nuevoAlumno = new Alumno(
            registerRequest.getNombre(),
            registerRequest.getApellidos(),
            emailLimp,
            TelefonoLimp,
            null, // dni is optional
            passwordEncriptada

        );
        return alumnoRepository.save(nuevoAlumno);
    }
}
