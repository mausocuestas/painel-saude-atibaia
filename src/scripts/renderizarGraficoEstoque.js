import { createClient } from '@supabase/supabase-js';
import * as echarts from 'echarts';

const chartContainer = document.getElementById('grafico-supabase');
if (!chartContainer) {
  console.error("Container do gráfico não encontrado. Saindo.");
} else {
  // Inicializamos o ECharts FORA da função para que ele persista
  const myChart = echarts.init(chartContainer);

  const supabaseUrl = chartContainer.dataset.url;
  const supabaseKey = chartContainer.dataset.key;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // --- A FUNÇÃO QUE CRIA A "RECEITA" COMPLETA ---
  function getChartOptions(farmacias, estoques) {
    return {
      title: { text: 'Estoque Total por Farmácia' },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: farmacias,
        axisLabel: { rotate: 30, interval: 0 }
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'Estoque',
        type: 'bar',
        data: estoques,
        label: { show: true, position: 'top' }
      }],
      grid: { containLabel: true, bottom: '20%' }
    };
  }

  // --- A FUNÇÃO PRINCIPAL DE BUSCA E RENDERIZAÇÃO ---
  async function carregarErenderizarGrafico(filtroFarmacia = 'todas') {
    // Mostra a animação de "carregando" no gráfico
    myChart.showLoading();

    try {
      let query = supabase.from('view_estoque_total_por_farmacia').select('farmacia, estoque_total');
      if (filtroFarmacia !== 'todas') {
        query = query.eq('farmacia', filtroFarmacia);
      }
      
      const { data, error } = await query.order('estoque_total', { ascending: false });

      if (error) throw error;
      
      const farmacias = data.map(item => item.farmacia);
      const estoques = data.map(item => item.estoque_total);

      // Usamos a função para gerar a receita completa
      const options = getChartOptions(farmacias, estoques);
      
      // Esconde o "carregando" e aplica a nova receita
      myChart.hideLoading();
      myChart.setOption(options, true); // O 'true' limpa o gráfico antigo antes de desenhar o novo

    } catch (e) {
      myChart.hideLoading();
      console.error("Erro ao buscar dados ou renderizar gráfico:", e);
      // Mostra uma mensagem de erro dentro do próprio gráfico
      myChart.setOption({
        title: {
          text: 'Erro ao carregar dados',
          subtext: e.message,
          left: 'center',
          textStyle: { color: 'red' }
        }
      });
    }
  }

  // --- O "OUVIDO" PARA O EVENTO DE FILTRO ---
  window.addEventListener('filtrarFarmacia', (event) => {
    const farmacia = event.detail.farmacia;
    carregarErenderizarGrafico(farmacia);
  });

  // --- CARGA INICIAL ---
  // A página carrega e chamamos a função pela primeira vez
  carregarErenderizarGrafico();
}
