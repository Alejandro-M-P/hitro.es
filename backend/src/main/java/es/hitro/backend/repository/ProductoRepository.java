package es.hitro.backend.repository;

import es.hitro.backend.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository  extends JpaRepository<Producto, Long> {
List<Producto> findByCategoria(String categoria);
List<Producto> findByNombreContainingIgnoreCase(String nombre);

List<Producto> findByStockLessThan(int stock );

List<Producto> findByPrecioBetween(BigDecimal precioMin, BigDecimal precioMax);


List<Producto> findByTallaContaining(String talla);


}

