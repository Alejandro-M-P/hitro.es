package es.hitro.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "alumnos")
public class Alumno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "apellido", nullable = false)
    private String apellidos;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "telefono", length = 25, unique = true)
    private String telefono;

    @Column(name = "dni", length = 20,  unique = true)
    private String dni;

    @Column(name = "password",nullable = false)
    private String password;


    public Alumno() {
    }


    public Alumno(String nombre, String apellido, String email, String telefono, String dni , String password) {
        setNombre(nombre);
        setApellidos(apellido);
        setEmail(email);
        settelefono(telefono);
        setDni(dni);
        setPassword(password);

    }



    // --- GETTERS
    public long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getApellidos() { return apellidos; }
    public String getEmail() { return email; }
    public String getTelefono() { return telefono; }
    public String getDni() { return dni; }
    public String getPassword() { return password; }

    // --- SETTERS
    public void setNombre(String nombre) {
        this.nombre = (nombre != null) ? nombre.trim() : null;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = (apellidos != null) ? apellidos.trim() : null;
    }

    public void setEmail(String email) {

        this.email = (email != null) ? email.trim().toLowerCase() : null;
    }

    public void settelefono(String nTelefono) {
        this.telefono = (nTelefono != null) ? nTelefono.trim() : null;
    }

    public void setDni(String dni) {

        this.dni = (dni != null) ? dni.trim().toUpperCase() : null;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}