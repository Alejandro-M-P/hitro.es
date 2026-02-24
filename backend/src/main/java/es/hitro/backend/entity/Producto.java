package es.hitro.backend.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
@Entity
@Table(name = "Producto")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String nombre;
    private String descripcion;
    private String categoria;
    private BigDecimal precio;
    private int stock;
    private String talla;





    public Producto() {
    }

    public Producto( String nombre, String descripcion, String categoria, BigDecimal precio, int stock, String talla) {
        setNombre(nombre);
        setDescripcion(descripcion);
        setCategoria(categoria);
        setPrecio(precio);
        setStock(stock);
        setTalla(talla);



    }


    public String getTalla() {
        return talla;
    }

    public void setTalla(String talla) {
        this.talla = talla;
    }

    public long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = (nombre != null) ? nombre.trim() : null;

    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
       this.descripcion = (descripcion != null) ? descripcion.trim() : null;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = (categoria != null) ? categoria.trim() : null;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {


        if (precio == null) {
            throw  new IllegalArgumentException("Precio no puede ser nulo.");

        }
      if (precio.compareTo(BigDecimal.ZERO) <= 0) {
          throw new IllegalArgumentException("Precio no puede ser negativo.");
      }

      this.precio = precio;
     }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        if (stock < 0) {
            throw  new IllegalArgumentException("Stock no puede ser negativo.");
        }
        this.stock = stock;
    }


}
