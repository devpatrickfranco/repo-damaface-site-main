import { TrendingUp, BarChart3 } from 'lucide-react'

const ChartDashboard = () => {
    return(
        <>
        <div className="gap-6">    
            {/* Gráfico de Performance */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Performance Mensal</h3>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="h-64 bg-gray-900/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Gráfico será implementado</p>
                  <p className="text-gray-400 text-xs">Dados de performance em tempo real</p>
                </div>
              </div>
            </div>
        </div>
        </>
    )
}

export default ChartDashboard