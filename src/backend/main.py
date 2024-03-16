from fastapi import FastAPI, HTTPException


# Pydantic es una librería para validar los datos.
# BaseModel sirve para definir clases para crear los modelos de datos que se van a usar en la API.
from pydantic import BaseModel

from typing import List

# Motor es una versión asíncrona de PyMongo,
# la biblioteca estándar de Python para trabajar con MongoDB.
import motor.motor_asyncio

# Para aceptar peticiones de diferentes dominios
from fastapi.middleware.cors import CORSMiddleware

# Define el modelo de datos para un usuario utilizando Pydantic.
# Esto ayuda a FastAPI a validar los tipos de datos entrantes.
class Plato(BaseModel):
    nombre: str
    descripcion: str
    categoria: str
    precio: float
    disponibilidad: bool

# Esto ayuda a FastAPI a validar los tipos de datos entrantes.
class Categoria(BaseModel):
    categoria: str

# Crea la instancia de la aplicación FastAPI
app = FastAPI()

# Lista de origenes permitidos
origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Métodos permitidos
    allow_headers=["*"], # Cabeceras permitidas
)
# Cadena de conexión a MongoDB con autenticación
MONGODB_URL = "mongodb://admin:123@mongodb:27017/?authSource=admin"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client.mesondb

# Endpoint para listar todas los categorias.
@app.get("/categorias/", response_description="Lista todas las categorias", response_model=List[Categoria])
async def list_categorias():
    categorias = await db["categorias"].find().to_list(1000)
    return categorias

# Endpoint para crear una nueva categoria.
@app.post("/categorias/", response_description="Añade una nueva categoria", response_model=Categoria)
async def create_categoria(categoria: Categoria):
    categoria_dict = categoria.dict()
    await db["categorias"].insert_one(categoria_dict)
    return categoria

# Endpoint para borrar una categoria específica por nombre.
@app.delete("/categorias/{categoria}", response_description="Borra una categoria por el nombre", status_code=204)
async def delete_categoria(categoria: str):
    delete_result = await db["categorias"].delete_one({"categoria": categoria})

    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Categoria con nombre {categoria} no se ha encontrado.")

# Endpoint para listar todos los platos.
@app.get("/platos/", response_description="Lista todas las categorias", response_model=List[Plato])
async def list_platos():
    platos = await db["platos"].find().to_list(1000)
    return platos



# Endpoint para crear un nuevo plato.
@app.post("/platos/", response_description="Añade un nuevo plato", response_model=Plato)
async def create_plato(plato: Plato):
    plato_dict = plato.dict()
    await db["platos"].insert_one(plato_dict)
    return plato

# Endpoint para obtener un plato a partir del nombre.
@app.get("/platos/{nombre}", response_description="Obtiene un plato por su nombre", response_model=Plato)
async def find_plato(nombre: str):
    plato = await db["platos"].find_one({"nombre": nombre})
    if plato is not None:
        return plato
    raise HTTPException(status_code=404, detail=f"Plato con nombre {nombre} no se ha encontrado.")

# Endpoint para borrar un plato específico por nombre.
@app.delete("/platos/{nombre}", response_description="Borra un plato por el nombre", status_code=204)
async def delete_plato(nombre: str):
    delete_result = await db["platos"].delete_one({"nombre": nombre})

    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Plato con nombre {nombre} no se ha encontrado.")

# Endpoint para actualizar un plato específico por nombre.
@app.put("/platos/{nombre}", response_description="Actualiza un plato por el nombre", response_model=Plato)
async def update_plato(nombre: str, plato: Plato):
    plato_dict = plato.dict()
    await db["platos"].update_one({"nombre": nombre}, {"$set": plato_dict})
    return plato

# Endpoint para obtener todos los platos que sean más baratos.
@app.get("/platos/precios/", response_description="Lista todos los precios menores de 9", response_model=List[Plato])
async def list_precios():
    pipeline = [
        {
            "$project":{
                    "nombre": 1,
                    "descripcion": 1,
                    "categoria": 1,
                    "precio": 1,
                    "disponibilidad": 1
            }
        },
        {
            "$match":{
                "precio":{"$lt":9}
            }
        }
    ]


    precios = await db["platos"].aggregate(pipeline).to_list(1000)
    return precios


# Endpoint para obtener todos los platos que sean más baratos.
@app.get("/platos/preciosAltos/", response_description="Lista todos los precios mayores de 10", response_model=List[Plato])
async def list_precios():
    pipeline = [
        {
            "$project":{
                    "nombre": 1,
                    "descripcion": 1,
                    "categoria": 1,
                    "precio": 1,
                    "disponibilidad": 1
            }
        },
        {
            "$match":{
                "precio":{"$gte":9}
            }
        }
    ]


    precios = await db["platos"].aggregate(pipeline).to_list(1000)
    return precios


# Endpoint para obtener todos los platos disponibles
@app.get("/platos/disponibilidad/", response_description="Lista todos los platos disponibles", response_model=List[Plato])
async def list_disponibles():
    pipeline = [
        {
            "$match": {"disponibilidad": True} 
        }
    ]

    # Ejecutar la consulta de agregación
    disponibilidad = await db["platos"].aggregate(pipeline).to_list(1000)
    
    return disponibilidad  # Devolver la lista de platos disponibles

# Endpoint para obtener todos los platos que no están disponibles
@app.get("/platos/sinDisponibilidad/", response_description="Lista todos los platos no disponibles", response_model=List[Plato])
async def list_noDisponibles():
    pipeline = [
        {
            "$match": {"disponibilidad": False} 
        }
    ]

    # Ejecutar la consulta de agregación
    disponibilidad = await db["platos"].aggregate(pipeline).to_list(1000)
    
    return disponibilidad  # Devolver la lista de platos no disponibles