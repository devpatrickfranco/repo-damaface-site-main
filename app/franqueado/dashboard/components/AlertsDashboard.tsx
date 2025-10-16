import { Calendar, AlertTriangle } from 'lucide-react'

const AlertsDashboard = () => {
    const alerts = [
    {
        id: 1,
        type: 'warning',
        title: 'Prazo de relatório',
        message: 'Relatório mensal vence em 3 dias',
        action: 'Visualizar'
    },
    {
        id: 2,
        type: 'info',
        title: 'Treinamento disponível',
        message: 'Novo módulo de capacitação liberado',
        action: 'Acessar'
    }
    ];

    return (
        <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Alertas e Lembretes</h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`bg-gray-800 rounded-lg border p-4 ${
                  alert.type === 'warning' ? 'border-orange-600/30 bg-orange-900/20' : 'border-blue-600/30 bg-blue-900/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        alert.type === 'warning' ? 'bg-orange-900/40' : 'bg-blue-900/40'
                      }`}>
                        {alert.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                        ) : (
                          <Calendar className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{alert.title}</h3>
                        <p className="text-sm text-gray-400">{alert.message}</p>
                      </div>
                    </div>
                    <button className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      alert.type === 'warning' 
                        ? 'bg-orange-600 text-white hover:bg-orange-700' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}>
                      {alert.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
    )
}

export default AlertsDashboard