package es.hitro.backend.repository; // <--- Mira que esto sea igual a tu carpeta

import es.hitro.backend.entity.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Long> {
    boolean existsByEmail(String email);
    boolean existsByTelefono(String telefono);
    boolean existsByDni(String dni);
    Optional<Alumno> findByEmail(String email);

}