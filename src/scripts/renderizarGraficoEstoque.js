import { createClient } from '@supabase/supabase-js';
import * as echarts from 'echarts';

// Esta função será chamada pelo nosso componente Astro
async function renderizarGrafico() {
  const chartContainer = document.getElementById('grafico-supabase');
  if (!chartContainer) return;

  try {
    // Pegamos as credenciais que o Astro colocou no HTML
    const supabaseUrl = chartContainer.dataset.url;
    const supabaseKey = chartContainer.dataset.key;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Credenciais Supabase não encontradas no HTML.');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('disponibilidades').select('farmacia, estoque');

    if (error) throw error;

    const estoqueAgregado = data.reduce((acc, { farmacia, estoque }) => {
      const nome = farmacia || 'Sem Nome';
      const valor = parseFloat(estoque) || 0;
      acc[nome] = (acc[nome] || 0) + valor;
      return acc;
    }, {});

    const farmacias = Object.keys(estoqueAgregado);
    const estoques = Object.values(estoqueAgregado);

    const myChart = echarts.init(chartContainer);
    const option = {
        title: { text: 'Estoque Total por Farmácia' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: farmacias, axisLabel: { rotate: 30, interval: 0 } },
        yAxis: { type: 'value' },
        series: [{ type: 'bar', data: estoques, label: { show: true, position: 'top' } }],
        grid: { containLabel: true, bottom: '20%' }
    };
    myChart.setOption(option);

  } catch (e) {
    chartContainer.innerHTML = `<p style="color:red;">Erro ao renderizar gráfico: ${e.message}</p>`;
    console.error(e);
  }
}

// Executamos a função
renderizarGrafico();
