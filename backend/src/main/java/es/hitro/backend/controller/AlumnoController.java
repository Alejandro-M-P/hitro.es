package es.hitro.backend.controller;

import es.hitro.backend.entity.Alumno;
import es.hitro.backend.repository.AlumnoRepository;
import es.hitro.backend.service.AlumnoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4321")
@RestController
@RequestMapping("/alumnos")
public class AlumnoController {



    private final AlumnoRepository repository;
    private final AlumnoService alumnoService;

    public AlumnoController(AlumnoRepository repository, AlumnoService alumnoService) {
        this.repository = repository;
        this.alumnoService = alumnoService;
    }


    @GetMapping
    public List<Alumno> listar() {
        return repository.findAll();
    }


    @PostMapping
    public Alumno guardar(@RequestBody Alumno alumno) {
        return alumnoService.encriptarContrasenia(alumno);
    }
}