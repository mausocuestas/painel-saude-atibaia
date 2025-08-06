import { createClient } from '@supabase/supabase-js';
import * as echarts from 'echarts';

// Esta função será chamada pelo nosso componente Astro
async function renderizarGrafico() {
  const chartContainer = document.getElementById('grafico-supabase');
  if (!chartContainer) return;

    // Conexão com o supabase
  try {
    // Pegamos as credenciais que o Astro colocou no HTML
    const supabaseUrl = chartContainer.dataset.url;
    const supabaseKey = chartContainer.dataset.key;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Credenciais Supabase não encontradas no HTML.');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    // const { data, error } = await supabase.from('disponibilidades').select('farmacia, estoque').range(0, 2000); // Tenta buscar até 5001 linhas (de 0 a 5000);
    // A query agora é muito mais simples e direta!
    const { data, error } = await supabase
      .from('view_estoque_total_por_farmacia') // <-- Usando a nova VIEW!
      .select('farmacia, estoque_total')
      .order('estoque_total', { ascending: false }); // Já podemos ordenar aqui!

    if (error) throw error;

    const farmacias = data.map(item => item.farmacia);
    const estoques = data.map(item => item.estoque_total);

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
