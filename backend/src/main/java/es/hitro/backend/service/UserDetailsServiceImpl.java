package service;

import es.hitro.backend.repository.AlumnoRepository;
import org.springframework.security.core.userdetails.UserDetailsService;
@Service
public class UserDetailsServiceImpl  implements UserDetailsService {
    private final AlumnoRepository alumnoRepository;
}
