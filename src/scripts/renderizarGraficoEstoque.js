import { createClient } from '@supabase/supabase-js';
import * as echarts from 'echarts';

const chartContainer = document.getElementById('grafico-supabase');
// Precisamos das credenciais aqui para fazer novas buscas
const supabaseUrl = chartContainer.dataset.url;
const supabaseKey = chartContainer.dataset.key;
const supabase = createClient(supabaseUrl, supabaseKey);

// Guardamos a instância do gráfico para poder atualizá-la
let myChart; 

// A função principal agora aceita um filtro
async function renderizarGrafico(filtroFarmacia = 'todas') {
  if (!chartContainer) return;
  
  // Mostra um indicador de carregamento
  myChart?.showLoading();

  try {
    // Construímos a query dinamicamente
    let query = supabase.from('view_estoque_total_por_farmacia').select('farmacia, estoque_total');

    // Se uma farmácia específica foi selecionada, adicionamos um filtro '.eq()'
    if (filtroFarmacia !== 'todas') {
      query = query.eq('farmacia', filtroFarmacia);
    }
    
    const { data, error } = await query.order('estoque_total', { ascending: false });

    if (error) throw error;
    
    const farmacias = data.map(item => item.farmacia);
    const estoques = data.map(item => item.estoque_total);

    // Se o gráfico ainda não foi criado, o inicializamos
    if (!myChart) {
      myChart = echarts.init(chartContainer);
    }

    // Atualizamos o gráfico com os novos dados
    myChart.setOption({
      xAxis: { data: farmacias },
      series: [{ data: estoques }]
    });

  } catch (e) {
    chartContainer.innerHTML = `<p style="color:red;">Erro: ${e.message}</p>`;
  } finally {
    // Esconde o indicador de carregamento
    myChart?.hideLoading();
  }
}

// 3. O "Ouvido" do Gráfico: Escutamos pelo anúncio do filtro
window.addEventListener('filtrarFarmacia', (event) => {
  const farmacia = event.detail.farmacia;
  console.log(`Gráfico ouviu o filtro. Buscando dados para: ${farmacia}`);
  // Chamamos a função de renderização, passando o novo filtro
  renderizarGrafico(farmacia);
});

// Primeira Carga: Renderizamos o gráfico com "todas" as farmácias
renderizarGrafico();
