const CommuniqueDashboard = () => {
      const comunicados = [
        {
        id: 1,
        title: 'Novos produtos disponíveis para 2025',
        preview: 'Confira os lançamentos da linha premium...',
        urgent: true
        },
        {
        id: 2,
        title: 'Treinamento obrigatório - Março',
        preview: 'Inscrições abertas até 15/03...',
        urgent: false
        }
    ];
    
    return (
        <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Comunicados Importantes</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {comunicados.map((comunicado) => (
                <div key={comunicado.id} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-white">{comunicado.title}</h3>
                        {comunicado.urgent && (
                          <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                            Urgente
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{comunicado.preview}</p>
                      <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                        Ver mais →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>       
    )   
}

export default CommuniqueDashboard