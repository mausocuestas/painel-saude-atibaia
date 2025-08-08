// Este script é o maestro da orquestra da página.

// 1. O "Ouvido": Escutamos por mudanças no nosso filtro
const filtro = document.getElementById('farmacia-filtro');

if (filtro) {
  filtro.addEventListener('change', (event) => {
    // Pegamos o valor selecionado (ex: "Centro" ou "todas")
    const farmaciaSelecionada = event.target.value;

    console.log(`Farmácia selecionada: ${farmaciaSelecionada}`);

    // 2. A "Comunicação": Disparamos um evento personalizado
    // Pense nisso como um "anúncio" para toda a página.
    // Estamos anunciando: "Atenção! O filtro da farmácia mudou!"
    // E junto com o anúncio, enviamos o nome da farmácia selecionada.
    const eventoDeFiltro = new CustomEvent('filtrarFarmacia', {
      detail: {
        farmacia: farmaciaSelecionada
      }
    });

    // Disparamos o evento para que outros scripts possam ouvi-lo.
    window.dispatchEvent(eventoDeFiltro);
  });
}
