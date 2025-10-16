import { CheckCircle, Users, Megaphone } from 'lucide-react'

const RecentActivaitesDashboard = () => {
    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Atividades Recentes</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Ticket #1234 resolvido</p>
                    <p className="text-xs text-gray-400">Há 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Novo lead cadastrado</p>
                    <p className="text-xs text-gray-400">Há 4 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Megaphone className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Comunicado publicado</p>
                    <p className="text-xs text-gray-400">Ontem</p>
                  </div>
                </div>
              </div>
            </div>
    )
}

export default RecentActivaitesDashboard