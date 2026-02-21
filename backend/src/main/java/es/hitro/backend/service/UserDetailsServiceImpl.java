package es.hitro.backend.service;

import com.fasterxml.jackson.databind.ser.impl.UnwrappingBeanSerializer;
import es.hitro.backend.repository.AlumnoRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AlumnoRepository alumnoRepository;

    public UserDetailsServiceImpl(AlumnoRepository alumnoRepository) {
        this.alumnoRepository = alumnoRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return alumnoRepository.findByEmail(email)
                .map(alumno -> User.withUsername(alumno.getEmail())
                        .password(alumno.getPassword())
                        .roles("User")
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("No existe: " + email));
    }
    }
