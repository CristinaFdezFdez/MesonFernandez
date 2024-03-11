//Funciones de acceso a la API de platos

import { Plato } from "~/models/plato"

// Obtiene todos los usuarios
export const getPlatos = async (): Promise<Plato[]> =>{
    try {
        const response = await fetch('http://localhost:8000/platos/')
        const platos = response.json()
        return platos
    } catch (error) {
        console.error(error)
    }
        return <Plato[]><unknown>null
}

// Obtiene todos los platos menores de 9 
export const getBarato = async (): Promise<Plato[]> =>{
    try {
        const response = await fetch('http://localhost:8000/platos/precios/')
        const baratos = response.json()
        return baratos
    } catch (error) {
        console.error(error)
    }
        return <Plato[]><unknown>null
}

// Obtiene todos los platos de precio mayor a 10
export const getCaros = async (): Promise<Plato[]> =>{
    try {
        const response = await fetch('http://localhost:8000/platos/preciosAltos/')
        const caros = response.json()
        return caros
    } catch (error) {
        console.error(error)
    }
        return <Plato[]><unknown>null
}

// Obtiene todos los platos disponibles
export const getDisponibles = async (): Promise<Plato[]> =>{
    try {
        const response = await fetch('http://localhost:8000/platos/disponibilidad/')
        const disponible = response.json()
        return disponible
    } catch (error) {
        console.error(error)
    }
        return <Plato[]><unknown>null
}

// Obtiene todos los platos no disponibles
export const getnoDisponibles = async (): Promise<Plato[]> =>{
    try {
        const response = await fetch('http://localhost:8000/platos/sinDisponibilidad/')
        const disponible = response.json()
        return disponible
    } catch (error) {
        console.error(error)
    }
        return <Plato[]><unknown>null
}

// Añade un plato
export const addPlato = async (plato: Plato) =>{
    try {
        await fetch('http://localhost:8000/platos/',
        {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(plato),
        })
    } catch (error) {
        console.error(error)
    }
}


// Modifica un plato
export const updatePlato = async (nombre: string, plato: Plato) =>{
    try {
        await fetch(`http://localhost:8000/platos/${nombre}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(plato),
        })
    } catch (error) {
        console.error(error)
    }
}

// Elimina un plato
export const deletePlatoById = async (nombre: string) =>{
    try {
        await fetch(`http://localhost:8000/platos/${nombre}`,
        {
            method: 'DELETE',
        })
    } catch (error) {
        console.error(error)
    }
}

