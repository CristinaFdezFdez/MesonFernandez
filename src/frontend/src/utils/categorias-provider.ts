//Funciones de acceso a la API de platos
import { Categoria } from "~/models/categoria"

// Obtiene todos los usuarios
export const getCategorias = async (): Promise<Categoria[]> =>{
    try {
        const response = await fetch('http://localhost:8000/categorias/')
        const categorias = response.json()
        return categorias
    } catch (error) {
        console.error(error)
    }
        return <Categoria[]><unknown>null
}

// Añade una categoria
export const addCategoria = async (categoria: Categoria) =>{
    try {
        await fetch('http://localhost:8000/categorias/',
        {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(categoria),
        })
    } catch (error) {
        console.error(error)
    }
}
