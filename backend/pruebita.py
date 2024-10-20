import base64
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
import os

# Función para encriptar el mensaje "is valid"
def encrypt_message(key, plaintext):
    key = key.ljust(32)[:32].encode()  # Asegurarse de que el key sea de 32 bytes

    # Generar un IV aleatorio
    iv = os.urandom(16)  # Para producción, usa un IV aleatorio
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(plaintext.encode()) + padder.finalize()

    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(padded_data) + encryptor.finalize()

    # Retornar el IV concatenado con el ciphertext codificado en base64
    return base64.b64encode(iv + ciphertext).decode()

def decrypt_message(key, encrypted_message):
    key = key.ljust(32)[:32].encode()  # Asegurarse de que el key sea de 32 bytes
    # Añadir padding al mensaje encriptado
    encrypted_message += '=' * (-len(encrypted_message) % 4)
    encrypted_message = base64.b64decode(encrypted_message.encode())
    
    iv = encrypted_message[:16]  # Extraer el IV del mensaje encriptado
    ciphertext = encrypted_message[16:]  # Extraer el ciphertext
    
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    padded_plaintext = decryptor.update(ciphertext) + decryptor.finalize()  # Corrección aquí
    
    unpadder = padding.PKCS7(128).unpadder()
    plaintext = unpadder.update(padded_plaintext) + unpadder.finalize()
    
    return plaintext.decode()

# Ejemplo de uso
secret_key = "Q3BTRKRU9VA4T5HH0G7M"
message_to_encrypt = "is valid"
# Encriptar el mensaje
encrypted_message = encrypt_message(secret_key, message_to_encrypt)
print("Mensaje Encriptado:", encrypted_message)

# Desencriptar el mensaje
decrypted_message = decrypt_message(secret_key, encrypted_message)
print("Mensaje Desencriptado:", decrypted_message)
