<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-strong border-b border-green-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center space-x-4">
          <div class="bg-gradient-to-br from-green-600 to-green-700 p-3 rounded-xl shadow-medium">
            <TrendingUp class="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 class="text-3xl font-bold gradient-text">Optimización Agrícola - AgroElqui SPA</h1>
            <p class="text-gray-600 font-medium">Análisis de Beneficios</p>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Panel de Entrada de Datos -->
        <div class="lg:col-span-1">
          <div class="card hover-lift">
            <div class="card-header">
              <h2 class="text-2xl font-bold text-gray-900 flex items-center">
                <Settings class="h-6 w-6 mr-2 text-green-600" />
                Parámetros del Cultivo
              </h2>
            </div>

            <div class="space-y-6">
              <div class="fade-in">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Precio de Venta ($/tonelada)
                </label>
                <input v-model.number="params.precioVenta" type="number" class="input-field" placeholder="4000"
                  @input="calcular" />
              </div>

              <div class="fade-in">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Rendimiento Base (ton/hectárea)
                </label>
                <input v-model.number="params.rendimientoBase" type="number" class="input-field" placeholder="20"
                  @input="calcular" />
              </div>

              <div class="fade-in">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Factor de Decrecimiento
                </label>
                <input v-model.number="params.factorDecrecimiento" type="number" step="0.01" class="input-field"
                  placeholder="0.1" @input="calcular" />
              </div>

              <div class="fade-in">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Costos Fijos ($)
                </label>
                <input v-model.number="params.costosFijos" type="number" class="input-field" placeholder="3000000"
                  @input="calcular" />
              </div>

              <div class="fade-in">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Costos Variables ($/hectárea)
                </label>
                <input v-model.number="params.costosVariables" type="number" class="input-field" placeholder="200"
                  @input="calcular" />
              </div>

              <button @click="calcular" class="btn-primary w-full">
                <Calculator class="h-5 w-5 inline mr-2" />
                Calcular Optimización
              </button>

              <div class="flex space-x-2">
                <button @click="guardarDatos" class="btn-secondary flex-1">
                  <Save class="h-4 w-4 inline mr-1" />
                  Guardar
                </button>
                <button @click="cargarDatos" class="btn-outline flex-1">
                  <Upload class="h-4 w-4 inline mr-1" />
                  Cargar
                </button>
              </div>

              <!-- Indicador de Viabilidad -->
              <div class="p-4 rounded-lg" :class="viabilidadClase">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <component :is="viabilidadIcono" class="h-5 w-5" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium">{{ viabilidadTexto }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel de Resultados -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Gráfico -->
          <div class="card hover-lift">
            <div class="card-header">
              <h2 class="text-2xl font-bold text-gray-900 flex items-center">
                <BarChart3 class="h-6 w-6 mr-2 text-blue-600" />
                Función de Beneficio
              </h2>
            </div>
            <div class="chart-container">
              <canvas ref="chartCanvas"></canvas>
            </div>
          </div>

          <!-- Resultados Principales -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6" v-if="esViable">
            <div
              class="result-card bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-strong p-6 text-white fade-in">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-green-100 text-sm font-medium">Superficie Óptima</p>
                  <p class="text-3xl font-bold">{{ formatNumber(resultados.superficieOptima) }}</p>
                  <p class="text-green-100 text-sm">hectáreas</p>
                </div>
                <Target class="h-12 w-12 text-green-200 bounce-gentle" />
              </div>
            </div>

            <div
              class="result-card bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-strong p-6 text-white fade-in">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-100 text-sm font-medium">Beneficio Máximo</p>
                  <p class="text-3xl font-bold">${{ formatNumber(resultados.beneficioMaximo) }}</p>
                  <p class="text-blue-100 text-sm">pesos chilenos</p>
                </div>
                <DollarSign class="h-12 w-12 text-blue-200 bounce-gentle" />
              </div>
            </div>
          </div>

          <!-- Análisis Detallado -->
          <div class="card hover-lift" v-if="esViable">
            <div class="card-header">
              <h2 class="text-2xl font-bold text-gray-900 flex items-center">
                <FileText class="h-6 w-6 mr-2 text-purple-600" />
                Análisis Matemático
              </h2>
            </div>

            <div class="space-y-6">
              <div class="equation fade-in">
                <h3 class="font-bold text-lg text-gray-900 mb-2">1. Función de Beneficio</h3>
                <p class="text-gray-700 mb-2">B(x) = <span class="equation-highlight">{{ ecuaciones.beneficio }}</span>
                </p>
                <p class="text-sm text-gray-600">Donde x representa la superficie cultivada en hectáreas</p>
              </div>

              <div class="equation fade-in">
                <h3 class="font-bold text-lg text-gray-900 mb-2">2. Primera Derivada (Beneficio Marginal)</h3>
                <p class="text-gray-700 mb-2">B'(x) = <span class="equation-highlight">{{ ecuaciones.primeraDerivada
                    }}</span></p>
                <p class="text-sm text-gray-600">Igualando a cero: x = <span class="equation-highlight">{{
                    formatNumber(resultados.superficieOptima) }}</span> hectáreas</p>
                <p class="text-sm text-gray-600">B'(0) = <span class="equation-highlight">{{
                    formatNumber(resultados.beneficioMarginalInicial) }}</span> (beneficio marginal inicial)</p>
              </div>

              <div class="equation fade-in">
                <h3 class="font-bold text-lg text-gray-900 mb-2">3. Segunda Derivada (Verificación)</h3>
                <p class="text-gray-700 mb-2">B''(x) = <span class="equation-highlight">{{ ecuaciones.segundaDerivada
                    }}</span></p>
                <p class="text-sm text-gray-600">Como B''(x) < 0, confirmamos que es un máximo</p>
              </div>
            </div>
          </div>

          <!-- Preguntas y Respuestas -->
          <div class="card hover-lift" v-if="esViable">
            <div class="card-header">
              <h2 class="text-2xl font-bold text-gray-900 flex items-center">
                <HelpCircle class="h-6 w-6 mr-2 text-orange-600" />
                Análisis de Preguntas Clave
              </h2>
            </div>

            <div class="space-y-6">
              <div class="border-l-4 border-green-500 pl-4 fade-in">
                <h3 class="font-bold text-lg text-gray-900 mb-2">
                  1. ¿Superficie óptima para máximo beneficio?
                </h3>
                <p class="text-gray-700">
                  La superficie óptima es <strong class="status-positive">{{ formatNumber(resultados.superficieOptima)
                    }} hectáreas</strong>,
                  calculada igualando la primera derivada a cero y resolviendo la ecuación resultante.
                </p>
              </div>

              <div class="border-l-4 border-blue-500 pl-4 fade-in">
                <h3 class="font-bold text-lg text-gray-900 mb-2">
                  2. ¿Cuándo disminuyen los beneficios marginales?
                </h3>
                <p class="text-gray-700">
                  Los beneficios marginales comienzan a ser negativos después de
                  <strong class="status-neutral">{{ formatNumber(resultados.superficieOptima) }} hectáreas</strong>.
                  Antes de este punto, cada hectárea adicional aumenta el beneficio total.
                </p>
              </div>

              <div class="border-l-4 border-purple-500 pl-4 fade-in">
                <h3 class="font-bold text-lg text-gray-900 mb-2">
                  3. ¿Verificación matemática del máximo?
                </h3>
                <p class="text-gray-700">
                  La segunda derivada B''(x) = <span class="equation-highlight">{{ ecuaciones.segundaDerivada }}</span>
                  es negativa,
                  confirmando que el punto crítico corresponde a un máximo de beneficio.
                </p>
              </div>

              <div class="border-l-4 border-orange-500 pl-4 fade-in">
                <h3 class="font-bold text-lg text-gray-900 mb-2">
                  4. ¿Impacto de desviarse ±10 hectáreas?
                </h3>
                <div class="space-y-3 mt-3">
                  <div class="flex items-center justify-between py-1">
                    <span class="text-gray-700 font-medium">Superficie óptima:</span>
                    <span class="status-positive font-mono">${{ formatNumber(resultados.beneficioMaximo) }}</span>
                  </div>

                  <div class="flex items-center justify-between py-1">
                    <div>
                      <span class="text-gray-700 font-medium">Con 10 hectáreas menos:</span>
                      <span class="text-sm text-gray-500 ml-2">({{ formatNumber(resultados.superficieOptima - 10) }}
                        ha)</span>
                    </div>
                    <div>
                      <span class="status-neutral font-mono">${{ formatNumber(resultados.beneficioMenos10) }}</span>
                      <span class="status-negative ml-3 font-mono">▼ ${{ formatNumber(resultados.beneficioMaximo -
                        resultados.beneficioMenos10) }}</span>
                    </div>
                  </div>

                  <div class="flex items-center justify-between py-1">
                    <div>
                      <span class="text-gray-700 font-medium">Con 10 hectáreas más:</span>
                      <span class="text-sm text-gray-500 ml-2">({{ formatNumber(resultados.superficieOptima + 10) }}
                        ha)</span>
                    </div>
                    <div>
                      <span class="status-neutral font-mono">${{ formatNumber(resultados.beneficioMas10) }}</span>
                      <span class="status-negative ml-3 font-mono">▼ ${{ formatNumber(resultados.beneficioMaximo -
                        resultados.beneficioMas10) }}</span>
                    </div>
                  </div>

                  <div class="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p class="text-sm text-yellow-700 flex items-start">
                      <i data-lucide="alert-triangle" class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"></i>
                      <span>
                        <strong>Conclusión:</strong> Una desviación de ±10 hectáreas de la superficie óptima
                        reduce el beneficio en aproximadamente
                        <span class="font-semibold">${{ formatNumber((resultados.beneficioMaximo -
                          resultados.beneficioMenos10 + resultados.beneficioMaximo - resultados.beneficioMas10)/2)
                          }}</span>
                        en promedio.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { 
  TrendingUp, Settings, Calculator, Save, Upload, BarChart3, 
  Target, DollarSign, FileText, HelpCircle, CheckCircle, 
  XCircle, AlertTriangle 
} from 'lucide-vue-next'

// Referencias reactivas
const chartCanvas = ref(null)
let chart = null
const activeTab = ref('analisis') // Para manejar pestañas

// Parámetros del problema
const params = reactive({
  precioVenta: 4000,
  rendimientoBase: 20,
  factorDecrecimiento: 0.1,
  costosFijos: 3000000,
  costosVariables: 200
})

// Resultados calculados
const resultados = reactive({
  superficieOptima: 0,
  beneficioMaximo: 0,
  beneficioMenos10: 0,
  beneficioMas10: 0,
  beneficioMarginalInicial: 0
})

// Ecuaciones formateadas
const ecuaciones = reactive({
  beneficio: '',
  primeraDerivada: '',
  segundaDerivada: ''
})

// Computed para viabilidad
const esViable = computed(() => {
  const { precioVenta, rendimientoBase, costosVariables } = params
  return (precioVenta * rendimientoBase - costosVariables) > 0
})

const viabilidadTexto = computed(() => {
  return esViable.value 
    ? 'Modelo económicamente viable' 
    : 'Modelo no viable - Ajustar parámetros'
})

const viabilidadIcono = computed(() => {
  return esViable.value ? CheckCircle : XCircle
})

const viabilidadClase = computed(() => {
  return esViable.value
    ? 'bg-green-50 border border-green-200 text-green-800'
    : 'bg-red-50 border border-red-200 text-red-800'
})

// Función de beneficio
const calcularBeneficio = (x, a, b, c) => {
  return a * Math.pow(x, 2) + b * x + c;
}

// Función principal de cálculo
const calcular = () => {
  const { precioVenta, rendimientoBase, factorDecrecimiento, costosVariables, costosFijos } = params
  
  // Coeficientes de B(x) = ax² + bx + c
  const a = -precioVenta * factorDecrecimiento
  const b = precioVenta * rendimientoBase - costosVariables
  const c = -costosFijos
  
  // Superficie óptima
  const superficieOptima = -b / (2 * a)
  
  // Beneficio máximo (usando los coeficientes actuales)
  const beneficioMaximo = a * Math.pow(superficieOptima, 2) + b * superficieOptima + c
  
  // CORRECCIÓN: Cálculo de beneficios con desviación usando los mismos coeficientes
  const beneficioMenos10 = superficieOptima >= 10 
    ? a * Math.pow(superficieOptima - 10, 2) + b * (superficieOptima - 10) + c
    : a * Math.pow(0, 2) + b * 0 + c
  
  const beneficioMas10 = a * Math.pow(superficieOptima + 10, 2) + b * (superficieOptima + 10) + c
  
  // Actualizar resultados
  resultados.superficieOptima = superficieOptima
  resultados.beneficioMaximo = beneficioMaximo
  resultados.beneficioMenos10 = beneficioMenos10
  resultados.beneficioMas10 = beneficioMas10
  resultados.beneficioMarginalInicial = b
  
  // Ecuaciones formateadas
  ecuaciones.beneficio = `${a.toFixed(2)}x² + ${b.toFixed(2)}x + ${c.toFixed(2)}`
  ecuaciones.primeraDerivada = `${(2*a).toFixed(2)}x + ${b.toFixed(2)}`
  ecuaciones.segundaDerivada = `${(2*a).toFixed(2)}`
  
  nextTick(() => {
    actualizarGrafico(a, b, c)
  })
}

// Función para formatear números
const formatNumber = (num) => {
  if (Math.abs(num) < 1000) {
    return num.toFixed(2)
  }
  return num.toLocaleString('es-CL', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

// Función para actualizar el gráfico
const actualizarGrafico = (a, b, c) => {
  if (!chartCanvas.value || !esViable.value) return
  
  const ctx = chartCanvas.value.getContext('2d')
  
  // Destruir gráfico anterior si existe
  if (chart) {
    chart.destroy()
  }
  
  // Generar datos para el gráfico
  const xValues = []
  const yValues = []
  const maxX = Math.max(200, resultados.superficieOptima * 1.5)
  
  for (let x = 0; x <= maxX; x += maxX/100) {
    xValues.push(x)
    yValues.push(calcularBeneficio(x, a, b, c))
  }
  
  // Crear nuevo gráfico
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: xValues.map(x => x.toFixed(0)),
      datasets: [{
        label: 'Beneficio ($)',
        data: yValues,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }, {
        label: 'Punto Óptimo',
        data: [{
          x: resultados.superficieOptima,
          y: resultados.beneficioMaximo
        }],
        backgroundColor: 'rgb(239, 68, 68)',
        borderColor: 'rgb(239, 68, 68)',
        pointRadius: 8,
        pointHoverRadius: 10,
        showLine: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Función de Beneficio vs Superficie Cultivada',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('es-CL', { 
                  style: 'currency', 
                  currency: 'CLP',
                  maximumFractionDigits: 0
                }).format(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Superficie (hectáreas)',
            font: { weight: 'bold' }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Beneficio ($)',
            font: { weight: 'bold' }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString('es-CL', {
                maximumFractionDigits: 0,
                minimumFractionDigits: 0
              })
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  })
}

// Funciones de almacenamiento
const guardarDatos = () => {
  localStorage.setItem('optimizacion-agricola-params', JSON.stringify(params))
  alert('Datos guardados exitosamente')
}

const cargarDatos = () => {
  const datosGuardados = localStorage.getItem('optimizacion-agricola-params')
  if (datosGuardados) {
    Object.assign(params, JSON.parse(datosGuardados))
    calcular()
    alert('Datos cargados exitosamente')
  } else {
    alert('No hay datos guardados')
  }
}

// Cargar Chart.js dinámicamente
onMounted(async () => {
  // Cargar Chart.js desde CDN
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js'
  script.onload = () => {
    // Calcular valores iniciales
    calcular()
    
    // Intentar cargar datos guardados
    const datosGuardados = localStorage.getItem('optimizacion-agricola-params')
    if (datosGuardados) {
      Object.assign(params, JSON.parse(datosGuardados))
      calcular()
    }
  }
  document.head.appendChild(script)
})
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #059669, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card {
  @apply bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden;
}

.card-header {
  @apply px-6 py-4 border-b border-gray-100 bg-gray-50;
}

.hover-lift {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.input-field {
  @apply w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors;
}

.btn-primary {
  @apply bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200;
}

.btn-secondary {
  @apply bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors;
}

.btn-outline {
  @apply border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors;
}

.chart-container {
  @apply p-6;
  height: 400px;
}

.equation-highlight {
  @apply bg-blue-100 px-2 py-1 rounded font-mono text-blue-800;
}

.status-positive {
  @apply text-green-600 font-semibold;
}

.status-neutral {
  @apply text-blue-600 font-semibold;
}

.status-negative {
  @apply text-red-600 font-semibold;
}

.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.bounce-gentle {
  animation: bounce 2s infinite;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
  40%, 43% { transform: translateY(-10px); }
  70% { transform: translateY(-5px); }
}
</style>