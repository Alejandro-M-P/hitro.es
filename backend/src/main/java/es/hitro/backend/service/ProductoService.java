package es.hitro.backend.service;

import es.hitro.backend.entity.Producto;
import es.hitro.backend.repository.AlumnoRepository;
import es.hitro.backend.repository.ProductoRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {



    private final ProductoRepository productoRepository;


    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;

    }


    public List<Producto> obtenerTodos() {

       return productoRepository.findAll();

    }

    public Producto guardarProducto(Producto p) {
        Optional <Producto> productoExistente = productoRepository.findById(p.getId());
        return   productoRepository.save(p);
    }


}
