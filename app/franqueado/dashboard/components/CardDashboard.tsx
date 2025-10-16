import { MessageSquare, Target, Megaphone, Clock} from 'lucide-react'

const CardDashboard = () => {
   const dashboardCards = [
    {
      title: 'Tickets Abertos',
      value: '12',
      change: '+3',
      changeType: 'increase',
      icon: MessageSquare,
      color: 'bg-blue-500'
    },
    {
      title: 'Leads Ativos',
      value: '48',
      change: '+12%',
      changeType: 'increase',
      icon: Target,
      color: 'bg-green-500'
    },
    {
      title: 'Comunicados',
      value: '5',
      change: '2 novos',
      changeType: 'neutral',
      icon: Megaphone,
      color: 'bg-orange-500'
    },
    {
      title: 'Tarefas Pendentes',
      value: '8',
      change: '-2',
      changeType: 'decrease',
      icon: Clock,
      color: 'bg-purple-500'
    }
  ]; 

  return(
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardCards.map((card, index) => (
              <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-sm font-medium ${
                    card.changeType === 'increase' ? 'text-green-600' : 
                    card.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {card.change}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{card.value}</h3>
                <p className="text-sm text-gray-400">{card.title}</p>
              </div>
            ))}
    </div>
  )
}

export default CardDashboard