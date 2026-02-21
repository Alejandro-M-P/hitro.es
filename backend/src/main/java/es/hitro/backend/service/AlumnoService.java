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
}
