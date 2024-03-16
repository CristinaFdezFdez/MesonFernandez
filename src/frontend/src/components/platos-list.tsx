import { component$, useStore, useTask$, useVisibleTask$, $, useSignal } from '@builder.io/qwik';
import { get } from 'http';
import { Categoria } from '~/models/categoria';
import { Plato } from '~/models/plato';
import { addPlato, getBarato, getDisponibles, getPlatos, getnoDisponibles, updatePlato } from '~/utils/platos-provider';
import { deletePlatoById, getCaros } from '../utils/platos-provider';
import { addCategoria, getCategorias } from '~/utils/categorias-provider';

export const PlatosList = component$(() => {

    const store = useStore<{ platos: Plato[], categorias: Categoria[]}>({
        platos: [],
        categorias: []        
    })

    const form = useStore({
        nombre: '',
        descripcion: '',
        categoria: '',
        precio: 0,
        disponibilidad: true,

    })

    const deletePlato = $(async (nombre: string) => {
        await deletePlatoById(nombre)
        store.platos = await getPlatos()
    })

    const addOrModify = useSignal("Añadir")

    const oldPlato = useSignal("")

    const platoPrecio = useSignal("Todos")


    useTask$(async () => {
        console.log("Desde useTask")
    })
    useVisibleTask$(async () => {
        console.log("Desde useVisibleTask")
        store.platos = await getPlatos()
        store.categorias = await getCategorias()
    })


    const handleSubmit = $(async (event) => {
        event.preventDefault() // Evita el comportaminento por defecto 
         // Limpiar espacios en blanco del principio y final de cada campo del formulario
            form.nombre = form.nombre.trim();
            form.descripcion = form.descripcion.trim();
            form.categoria = form.categoria.trim();
        if (addOrModify.value === 'Añadir') {
            await addPlato(form)
        } else {
            await updatePlato(oldPlato.value, form)
            addOrModify.value = "Añadir"
        }
    })

    const handleInputChange = $((event: any) => {
        const target = event.target as HTMLInputElement
        form[target.name] = target.value
    })


    const copyForm = $((plato: Plato) => {
        form.nombre = plato.nombre
        form.descripcion = plato.descripcion
        form.categoria = plato.categoria
        form.precio = plato.precio
        form.disponibilidad = plato.disponibilidad
    })

    const cleanForm = $(() => {
        form.nombre = ""
        form.descripcion = ""
        form.categoria = ""
        form.precio = 0
        form.disponibilidad = true
    })
    return (
        <div class="flex justify-center">
            <div>
                <div class="principal">
                    <table class=" border-separate border-spacing-2 w-full">
                        <thead>
                            <tr>
                                <th class="title">Nombre</th>
                                <th class="title">Descripción</th>
                                <th class="title">Categoría</th>
                                <th class="title">Precio</th>
                                <th class="title">Disponibilidad</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.platos.map((plato) => (
                                <tr key={plato.nombre}>
                                    <td>{plato.nombre}</td>
                                    <td>{plato.descripcion}</td>
                                    <td>{plato.categoria}</td>
                                    <td>{plato.precio}<span class="ml-2 text-white">€</span></td>
                                    <td>{plato.disponibilidad ? "Sí" : "No"}</td>
                                    <td>
                                        <button
                                            class="bg-red-500"
                                            onClick$={() => deletePlato(plato.nombre)}>
                                            <i class="fa-solid fa-trash"></i>
                                            Borrar
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            class="bg-orange-400"
                                            onClick$={() => {
                                                addOrModify.value = 'Modificar';
                                                oldPlato.value = plato.nombre;
                                                copyForm(plato);
                                            }}>
                                            <i class="fa-solid fa-pencil"></i>
                                            Modificar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <form onSubmit$={handleSubmit} class="ml-7">
                                    <td>
                                        <input required
                                            name='nombre'
                                            type="text"
                                            value={form.nombre}
                                            onInput$={handleInputChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name='descripcion'
                                            type="text"
                                            value={form.descripcion}
                                            onInput$={handleInputChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            list='categoriaList'
                                            name="categoria"
                                            id="categoria"
                                            value={form.categoria}
                                            onInput$={handleInputChange}
                                            />
                                            <datalist id="categoriaList">
                                            {store.categorias.map(categoria => (
                                                <option value={categoria.categoria}></option>
                                            ))}
                                            </datalist>
                                    </td>


                                <td>
                                        <input
                                            name='precio'
                                            type="number" step="0.1"
                                            value={form.precio}
                                            onInput$={handleInputChange}
                                        />
                                </td>
                                    <td>
                                        <select
                                            name="disponibilidad"
                                            value={form.disponibilidad.toString()}
                                            onInput$={handleInputChange}
                                        >
                                            <option value="true">Sí</option>
                                            <option value="false">No</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            class="bg-green-400"
                                            type='submit'>
                                            <i class="fa-solid fa-check"></i>
                                            Aceptar</button>
                                    </td>
                                    <td>
                                        <span
                                            class="button bg-red-500"
                                            style={`visibility: ${addOrModify.value === 'Añadir' ? 'hidden' : 'visible'}`}
                                            onClick$={() => { addOrModify.value = "Añadir"; cleanForm(); }}>
                                            <i class="fa-solid fa-x"></i>
                                            Cancelar
                                        </span>
                                    </td>
                                        
                                    </form>
                                    </div>



                <button class={platoPrecio.value === 'Todos' ? "button-filter-highlighted" : "button-filter"}
                    onClick$={
                        async () => { platoPrecio.value = 'Todos'; store.platos = await getPlatos() }}>
                    Todos
                    <i class="fa-solid fa-utensils"></i>
                </button>
                <button class={platoPrecio.value === 'Precio menor' ? "button-filter-highlighted" : "button-filter"}
                    onClick$={
                        async () => { platoPrecio.value = 'Precio menor'; store.platos = await getBarato() }
                    }>
                    Precio descendente
                    <i class="fa-solid fa-arrow-down"></i>
                </button>
                <button class={platoPrecio.value === 'Precio mayor' ? "button-filter-highlighted" : "button-filter"}
                    onClick$={
                        async () => { platoPrecio.value = 'Precio mayor'; store.platos = await getCaros() }}>
                    Precio ascendente
                    <i class="fa-solid fa-arrow-up"></i>
                </button>

                <button class={platoPrecio.value === 'Disponible' ? "button-filter-highlighted" : "button-filter"}
                    onClick$={
                        async () => { platoPrecio.value = 'Disponible'; store.platos = await getDisponibles() }}>
                    Disponibles
                    <i class="fa-solid fa-bowl-food"></i>
                </button>

                <button class={platoPrecio.value === 'NoDisponible' ? "button-filter-highlighted" : "button-filter"}
                    onClick$={
                        async () => { platoPrecio.value = 'NoDisponible'; store.platos = await getnoDisponibles() }}>
                    No disponibles
                    <i class="fa-solid fa-x"></i>
                </button>
            </div>
        </div>
    )
});