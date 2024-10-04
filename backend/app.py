from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from backend.database import *
from .models import *


# Crea todas las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def is_running():
    return {"status":"running"}

# Ejemplo de inserción en la tabla de productos
@app.post("/productos/")
def create_producto(nombre: str, precio: float, cantidad: int, db: Session = Depends(get_db)):
    nuevo_producto = Producto(nombre=nombre, precio=precio, cantidad=cantidad)
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto

# Obtener todos los productos
@app.get("/productos/")
def get_productos(db: Session = Depends(get_db)):
    return db.query(Producto).all()

# Ejemplo de inserción en la tabla de clientes
@app.post("/clientes/")
def create_cliente(nombre: str, email: str, db: Session = Depends(get_db)):
    nuevo_cliente = Cliente(nombre=nombre, email=email)
    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)
    return nuevo_cliente

# Obtener todos los clientes
@app.get("/clientes/")
def get_clientes(db: Session = Depends(get_db)):
    return db.query(Cliente).all()

# Ejemplo de inserción en la tabla de ventas
@app.post("/ventas/")
def create_venta(id_cliente: int, total_venta: float, fecha: str, db: Session = Depends(get_db)):
    nueva_venta = Venta(id_cliente=id_cliente, total_venta=total_venta, fecha=fecha)
    db.add(nueva_venta)
    db.commit()
    db.refresh(nueva_venta)
    return nueva_venta

# Obtener todas las ventas
@app.get("/ventas/")
def get_ventas(db: Session = Depends(get_db)):
    return db.query(Venta).all()

# Ejemplo de inserción en la tabla de promociones
@app.post("/promociones/")
def create_promocion(descripcion: str, db: Session = Depends(get_db)):
    nueva_promocion = Promocion(descripcion=descripcion)
    db.add(nueva_promocion)
    db.commit()
    db.refresh(nueva_promocion)
    return nueva_promocion

# Obtener todas las promociones
@app.get("/promociones/")
def get_promociones(db: Session = Depends(get_db)):
    return db.query(Promocion).all()

# Obtener todos los nodos de registro
@app.get("/nodos_registro/")
def get_nodos_registro(db: Session = Depends(get_db)):
    return db.query(NodoRegistro).all()

# Obtener todos los productos vendidos en ventas
@app.get("/ventas_productos/")
def get_ventas_productos(db: Session = Depends(get_db)):
    return db.query(VentasProducto).all()