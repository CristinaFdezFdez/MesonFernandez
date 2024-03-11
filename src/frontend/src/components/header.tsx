import ImgPlato from '~/media/plato.png?jsx';
import { component$ } from '@builder.io/qwik';

export const Header = component$(() => {
    return (
        <header class="p-3 text-center flex flex-col items-center">
            <div class="flex items-center">
                <h1 class="text-white text-6xl font-semibold tracking-wide uppercase shadow-lg flex items-center">
                    <ImgPlato class="mr-3 " alt="" />Mesón Fernández
                </h1>
            </div>
            <h2 class="text-3xl text-orange-300">Gestión del menú</h2>
        </header>
    );
});
