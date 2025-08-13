import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// Importamos a integração correta que acabamos de instalar
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // E a registramos aqui
  integrations: [tailwind(), svelte({ extensions: ['.svelte']} )]
});
