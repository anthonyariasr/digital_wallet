import qrcode, os, time, psycopg2, hmac, hashlib
from .database import get_db, engine
from .models import Product, Order, Base, products_order_table
from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from sqlalchemy import inspect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
import base64

SECRET_KEY = ""

# Initialize FastAPI app
app = FastAPI()

# Montar el directorio de imágenes para servir archivos estáticos
app.mount("/images", StaticFiles(directory="backend/images"), name="images")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir solicitudes desde el frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all tables in the current FastAPI database (if they do not already exist)
Base.metadata.create_all(bind=engine)
inspector = inspect(engine)
print("print:" + str(inspector.get_table_names()))  

# PostgreSQL connection settings
POSTGRES_HOST = ""
POSTGRES_DB = ""
POSTGRES_USER = ""
POSTGRES_PASSWORD = ""
POSTGRES_PORT = ""

# Function to connect to PostgreSQL
def get_postgres_connection():
    conn = psycopg2.connect(
        dbname=POSTGRES_DB,
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        host=POSTGRES_HOST,
        port=POSTGRES_PORT
    )
    return conn

# Function to check the order status in PostgreSQL and hold until a response is received or timeout occurs
def check_order_status(order_id: int, total, db: Session):
    conn = get_postgres_connection()
    cursor = conn.cursor()
    max_attempts = 12  # 12 attempts (12 * 5 seconds = 60 seconds)
    attempts = 0

    while attempts < max_attempts:
        time.sleep(5)  # Wait 5 seconds between queries
        try:
            cursor.execute("SELECT client_id, processed FROM Sale_Order WHERE order_id = %s", (order_id,))
            result = cursor.fetchone()

            if result and result[1]:  # If processed is True
                client_id = result[0]
                order = db.query(Order).filter(Order.id == order_id).first()
                if order:
                    order.client_id = client_id
                    order.processed = True
                    db.commit()
                    cursor.close()
                    conn.close()
                    return {"message": "Order processed successfully", "order_id": order_id}
        except psycopg2.Error as e:
            print(f"Error querying PostgreSQL: {e}")
            break
        
        attempts += 1

    # If no positive response in 1 minute, rollback the order
    cursor.execute("delete from Sale_Order where order_id = %s", (order_id,))

    cursor.close()
    conn.close()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if order:
            db.delete(order)
            db.commit()
            return {"message": "Order could not be processed. Order has been rolled back", "order_id": order_id}
    except SQLAlchemyError as e:
        db.rollback()
        return {"message": f"Error rolling back order: {e}", "order_id": order_id}

# Function to insert transaction in the central node
def insert_transaction(order_id: int, client_id: int, total: float):
    conn = get_postgres_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO Sale_Order (order_id, client_id, processed, total) VALUES (%s, %s, %s, %s)", 
                       (order_id, client_id, True, total))
        conn.commit()
    except psycopg2.Error as e:
        print(f"Error inserting transaction in PostgreSQL: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

# Función para encriptar el mensaje "is valid"
def encrypt_message(key, plaintext):
    key = key.ljust(32)[:32].encode()  # Asegurarse que el key sea de 32 bytes

    iv = b'\x00' * 16  # Vector de inicialización (IV), usa un valor aleatorio en producción
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(plaintext.encode()) + padder.finalize()

    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(padded_data) + encryptor.finalize()

    return base64.b64encode(iv + ciphertext).decode()

# POST routes
# Route to add predefined products to the database
@app.post("/add-products")
def add_products(db: Session = Depends(get_db)):
    products = [
        {"name": "PlayStation 5", "price": 499.99, "stock": 50, "sale": None, "image":"https://www.unimart.com/cdn/shop/files/SonyConsoladeVideojuegosPlayStation5SlimPS5DigitalEdition.jpg?v=1701902756"},
        {"name": "Xbox Series X", "price": 499.99, "stock": 40, "sale": 10.0, "image":"https://www.intelec.co.cr/image/cache/catalog/catalogo/Juegos/RRT-00001-800x800h.jpg.webp"},  # 10% discount
        {"name": "Nintendo Switch", "price": 299.99, "stock": 70, "sale": 5.0, "image":"https://www.intelec.co.cr/image/cache/catalog/catalogo/HEG-S-KABAA-2-800x800.jpg.webp"},  # 5% discount
        {"name": "iPhone 13", "price": 999.99, "stock": 30, "sale": None, "image":"https://tiendasishop.com/media/catalog/product/m/l/mlq63lz_a.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700"},
        {"name": "Samsung Galaxy S21", "price": 799.99, "stock": 25, "sale": 15.0, "image":"https://www.cqnetcr.com/117216-large_default/celular-samsung-galaxy-s21-fe-5g-sim-doble-64-.jpg"},  # 15% discount
        {"name": "MacBook Pro", "price": 1299.99, "stock": 20, "sale": 10.0, "image":"https://tiendasishop.com/media/catalog/product/m/a/macbook_pro_13_in_silver_pdp_image_position-2_coes_7.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700"},  # 10% discount
        {"name": "Dell XPS 13", "price": 1099.99, "stock": 15, "sale": None, "image":"https://www.cqnetcr.com/106012-large_default/laptop-dell-xps-13-9310-core-i7-1165g7-16gb-512gb.jpg"},
        {"name": "Sony WH-1000XM4", "price": 349.99, "stock": 100, "sale": None, "image":"https://www.sony.co.cr/image/5d02da5df552836db894cead8a68f5f3?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF"},
        {"name": "Apple Watch Series 7", "price": 399.99, "stock": 80, "sale": 5.0, "image":"https://tiendasishop.com/media/catalog/product/m/k/mkn73be_a.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700"},  # 5% discount
        {"name": "GoPro Hero 9", "price": 399.99, "stock": 60, "sale": None, "image":"https://m.media-amazon.com/images/I/517+lSO8ilL.jpg"},
    ]
    for product_data in products:
        product = Product(
            name=product_data["name"],
            price=product_data["price"],
            stock=product_data["stock"],
            sale=product_data["sale"],
            img_link=product_data["image"]
        )
        db.add(product)
    
    db.commit()
    return {"message": "Products have been added to the database."}

@app.post("/create-order")
def create_order(product_ids: list[int], quantities: list[int], client_id: int = None, db: Session = Depends(get_db)):
    if len(product_ids) != len(quantities):
        raise HTTPException(status_code=400, detail="Product IDs and quantities length mismatch.")
    
    order = Order(client_id=client_id, processed=False, total=0.0)
    db.add(order)
    db.commit()
    db.refresh(order)

    total = 0.0
    for product_id, quantity in zip(product_ids, quantities):
        product = db.query(Product).filter(Product.id == product_id).first()
        
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found.")
        
        # Apply discount if necessary
        price_with_discount = product.price - (product.price * (product.sale / 100)) if product.sale else product.price
        subtotal = price_with_discount * quantity
        total += subtotal

        # Insert the product into the association table
        db.execute(products_order_table.insert().values(order_id=order.id, product_id=product.id, quantity=quantity, subtotal=subtotal))

    order.total = total
    db.commit()

    insert_transaction(order.id, client_id, total)

    # Generate QR code with order ID
    qr_data = {"transaction": "sale", "OrderID": order.id}
    qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=4)
    qr.add_data(qr_data)
    qr.make(fit=True)

    qr_directory = "backend/images"
    if not os.path.exists(qr_directory):
        os.makedirs(qr_directory)

    filename = f"order_{order.id}_qr.png"
    qr_filename = os.path.join(qr_directory, filename)
    qr_img = qr.make_image(fill='black', back_color='white')
    qr_img.save(qr_filename)

    return {"message": f"Order with ID {order.id} created successfully", "qr_filename": filename}


@app.post("/qr-code/recharge")
def generate_recharge_qr(amount: float):
    if not amount:
        raise HTTPException(status_code=400, detail="Amount not provided.")

    # Mensaje encriptado "is valid"
    encrypted_message = encrypt_message(SECRET_KEY, "is valid")

    # Datos que irán en el QR (sin hash, pero con mensaje encriptado)
    qr_data = {"transaction": "recharge", "amount": amount, "encrypted_message": encrypted_message}
    
    # Crear el QR con los datos
    qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=4)
    qr.add_data(qr_data)
    qr.make(fit=True)

    # Guardar el QR en un directorio
    qr_directory = "backend/images"
    if not os.path.exists(qr_directory):
        os.makedirs(qr_directory)

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"recharge_{timestamp}.png"
    qr_filename = os.path.join(qr_directory, filename)

    # Generar la imagen del QR y guardarla
    qr_img = qr.make_image(fill='black', back_color='white')
    qr_img.save(qr_filename)

    return {"message": "QR code generated successfully", "qr_filename": filename}


@app.post("/check-order-status/{order_id}")
def check_order_status_endpoint(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    total = order.total
    result = check_order_status(order_id, total, db)
    return result


# GET routes
@app.get("/")
def is_running():
    return {"status": "running"}

@app.get("/orders")
def get_all_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    if not orders:
        raise HTTPException(status_code=404, detail="No orders found.")
    
    all_orders = []
    for order in orders:
        products_in_order = db.execute(products_order_table.select().where(products_order_table.c.order_id == order.id)).fetchall()

        product_list = []
        for row in products_in_order:
            product = db.query(Product).filter(Product.id == row.product_id).first()
            product_info = {
                "product_id": row.product_id,
                "name": product.name,
                "quantity": row.quantity,
                "subtotal": row.subtotal
            }
            product_list.append(product_info)

        order_info = {
            "order_id": order.id,
            "client_id": order.client_id,
            "total": order.total,
            "products": product_list
        }
        all_orders.append(order_info)

    return {"orders": all_orders}

@app.get("/qr-code/{order_id}")
def get_qr_code(order_id: int):
    qr_directory = "backend/images"
    qr_filename = os.path.join(qr_directory, f"order_{order_id}_qr.png")
    
    if not os.path.exists(qr_filename):
        raise HTTPException(status_code=404, detail="QR code not found")
    
    return FileResponse(qr_filename)


@app.get("/order/{order_id}")
def get_order_by_id(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    
    products_in_order = db.execute(products_order_table.select().where(products_order_table.c.order_id == order_id)).fetchall()

    product_list = []
    for row in products_in_order:
        product = db.query(Product).filter(Product.id == row.product_id).first()
        product_info = {
            "product_id": row.product_id,
            "name": product.name,
            "quantity": row.quantity,
            "subtotal": row.subtotal
        }
        product_list.append(product_info)

    return {"order_id": order.id, "client_id": order.client_id, "total": order.total, "products": product_list}


@app.get("/products")
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    if not products:
        raise HTTPException(status_code=404, detail="No products found.")
    
    product_list = [{"id": product.id, "name": product.name, "price": product.price, "stock": product.stock, "sale": product.sale, "image": product.img_link} for product in products]
    return {"products": product_list}