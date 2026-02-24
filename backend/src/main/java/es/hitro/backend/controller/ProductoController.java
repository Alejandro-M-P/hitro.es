package es.hitro.backend.controller;

import es.hitro.backend.entity.Producto;
import es.hitro.backend.service.ProductoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/productos")

public class ProductoController {

    private final ProductoService productoService;
    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }



    @GetMapping
    public List<Producto> listar() {
        return productoService.obtenerTodos();
    }
}
