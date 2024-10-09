from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Intermediate table: Products_Order
products_order_table = Table('products_order', Base.metadata,
    Column('order_id', Integer, ForeignKey('orders.id'), primary_key=True),
    Column('product_id', Integer, ForeignKey('products.id'), primary_key=True),
    Column('quantity', Integer, nullable=False),
    Column('subtotal', Float, nullable=False)  # Calculated based on product price and quantity
)

# Product model
class Product(Base):
    __tablename__ = 'products'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False)
    sale = Column(Float, nullable=True)  # Sale price, nullable since not all products are on sale
    img_link = Column(String, nullable=True)
    
    # Relationship with Order via the association table
    orders = relationship("Order", secondary=products_order_table, back_populates="products")

# Order model
class Order(Base):
    __tablename__ = 'orders'
    
    id = Column(Integer, primary_key=True)
    client_id = Column(Integer, nullable=True)  # Simple integer, no foreign key
    processed = Column(Boolean, default=False)  # Boolean flag for processing state
    total = Column(Float, nullable=False, default=0.0)  # Will be calculated from subtotals of associated products
    
    # Relationship with Product via the association table
    products = relationship("Product", secondary=products_order_table, back_populates="orders")
