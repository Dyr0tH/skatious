import React from 'react'

// Import local club logos
import RealLogo from '../../assets/clubs/Real.png'
import ManchesterLogo from '../../assets/clubs/Manchester.png'
import BarcelonaLogo from '../../assets/clubs/Barcelona.png'
import BayernLogo from '../../assets/clubs/Bayern.png'

// Import local player images
import MessiImg from '../../assets/players/messi.jpeg'
import RonaldoImg from '../../assets/players/ronaldo.jpeg'
import LamineImg from '../../assets/players/lamine.jpeg'
import JudeImg from '../../assets/players/jude.jpeg'
import MbappeImg from '../../assets/players/mbappe.jpeg'
import AssisImg from '../../assets/players/assis.jpeg'

const teams = [
  {
    name: 'Real Madrid',
    logo: RealLogo
  },
  {
    name: 'Manchester City',
    logo: ManchesterLogo
  },
  {
    name: 'FC Barcelona',
    logo: BarcelonaLogo
  },
  {
    name: 'Bayern Munich',
    logo: BayernLogo
  }
]

const players = [
  {
    name: 'Lionel Messi',
    team: 'Inter Miami CF',
    image: MessiImg
  },
  {
    name: 'Cristiano Ronaldo',
    team: 'Al-Nassr FC',
    image: RonaldoImg
  },
  {
    name: 'Lamine Yamal Nasraoui Ebana',
    team: 'FC Barcelona',
    image: LamineImg
  },
  {
    name: 'Jude Bellingham',
    team: 'Real Madrid',
    image: JudeImg
  },
  {
    name: 'Kylian Mbappé',
    team: 'Real Madrid',
    image: MbappeImg
  },
  {
    name: 'Ronaldinho',
    team: 'Atlético Mineiro (Retired)',
    image: AssisImg
  }
]

export default function PlayersShowcase() {
  return (
    <div className="max-w-5xl mx-auto py-16 w-full">
      <h1 className="font-display text-4xl font-bold text-navy-900 text-center mb-10">
        Top Football Teams
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 mx-8">
        {teams.map((team) => (
          <div key={team.name} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
            <img
              src={team.logo}
              alt={team.name}
              className="w-20 h-20 object-contain mb-4"
            />
            <h2 className="font-heading text-xl font-bold text-navy-900 mb-2">{team.name}</h2>
          </div>
        ))}
      </div>

      <h2 className="font-display text-3xl font-bold text-navy-900 text-center mb-10">
        Best Players
      </h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-8">
        {players.map((player) => (
          <div key={player.name} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
            <img
              src={player.image}
              alt={player.name}
              className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-emerald-100"
            />
            <h3 className="font-heading text-lg font-bold text-navy-900 mb-1">{player.name}</h3>
            <p className="font-body text-gray-600">{player.team}</p>
          </div>
        ))}
      </div>
    </div>
  )
}