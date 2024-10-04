from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Tabla intermedia para la relación muchos a muchos entre Promociones y Productos
promociones_productos = Table(
    'promociones_productos',
    Base.metadata,
    Column('id_producto', Integer, ForeignKey('productos.id_producto'), primary_key=True),
    Column('id_promocion', Integer, ForeignKey('promociones.id_promocion'), primary_key=True)
)

class NodoRegistro(Base):
    __tablename__ = 'nodo_registro'
    id_nodo = Column(Integer, primary_key=True)
    ip = Column(String(50), nullable=False)

class Producto(Base):
    __tablename__ = 'productos'
    id_producto = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    precio = Column(Float, nullable=False)
    cantidad = Column(Integer, nullable=False)
    
    # Relación con Promociones
    promociones = relationship('Promocion', secondary=promociones_productos, back_populates='productos')

class Promocion(Base):
    __tablename__ = 'promociones'
    id_promocion = Column(Integer, primary_key=True)
    descripcion = Column(String(200), nullable=False)
    
    # Relación con Productos
    productos = relationship('Producto', secondary=promociones_productos, back_populates='promociones')

class Cliente(Base):
    __tablename__ = 'clientes'
    id_cliente = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)

class Venta(Base):
    __tablename__ = 'ventas'
    id_venta = Column(Integer, primary_key=True)
    id_cliente = Column(Integer, ForeignKey('clientes.id_cliente'), nullable=False)
    total_venta = Column(Float, nullable=False)
    fecha = Column(DateTime, nullable=False)
    
    # Relación con Cliente
    cliente = relationship('Cliente', back_populates='ventas')
    
    # Relación con VentasProductos
    productos_vendidos = relationship('VentasProducto', back_populates='venta')

# Tabla intermedia para la relación entre Ventas y Productos
class VentasProducto(Base):
    __tablename__ = 'ventas_productos'
    id_venta = Column(Integer, ForeignKey('ventas.id_venta'), primary_key=True)
    id_producto = Column(Integer, ForeignKey('productos.id_producto'), primary_key=True)
    cantidad = Column(Integer, nullable=False)
    precio_unitario = Column(Float, nullable=False)
    
    # Relaciones
    venta = relationship('Venta', back_populates='productos_vendidos')
    producto = relationship('Producto', back_populates='ventas_producto')

# Añadir las relaciones inversas
Cliente.ventas = relationship('Venta', order_by=Venta.id_venta, back_populates='cliente')
Producto.ventas_producto = relationship('VentasProducto', back_populates='producto')
