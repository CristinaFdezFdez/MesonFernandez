import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { PlatosList } from "~/components/platos-list";

export default component$(() => {
  return (
    <PlatosList />
  );
});

export const head: DocumentHead = {
  title: "Mesón Fernández",
  meta: [
    {
      name: "description",
      content: "Gestión de la carta del Mesón Fernández",
    },
  ]
};
