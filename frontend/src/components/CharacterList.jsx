import { Film, Globe, User, Users } from "lucide-react";

export default function CharacterList({ characters, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-gray-800 animate-pulse h-40" />
        ))}
      </div>
    );
  }

  if (!characters || characters.length === 0) {
    return null; // The fallback "No characters found" is now handled in the parent
  }

  return (
    <ul className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 gap-4">
      {characters.map((char, index) => (
        <li
          key={char.uid || index}
          className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-slate-800/60 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-2">{char.name}</h2>
          <div className="w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent mb-4"></div>
          <div className="space-y-3">
            <div className="flex items-center text-gray-300">
              <User className="w-4 h-4 mr-3 text-purple-400" />
              <span className="text-md">
                <span className="font-medium">Height:</span> {char.height}
              </span>
            </div>
            <div className="flex items-center text-gray-300">
              <User className="w-4 h-4 mr-3 text-purple-400" />
              <span className="text-md">
                <span className="font-medium">Mass:</span> {char.mass}
              </span>
            </div>
            <div className="flex items-center text-gray-300">
              <Globe className="w-4 h-4 mr-3 text-purple-400" />
              <span className="text-md">
                <span className="font-medium">Homeworld:</span> {char.homeworld}
              </span>
            </div>
            <div className="flex items-center text-gray-300">
              <Users className="w-4 h-4 mr-3 text-purple-400" />
              <span className="text-md">
                <span className="font-medium">Species:</span> {char.species}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-start text-gray-300">
                <Film className="w-4 h-4 mr-3 text-purple-400 mt-1.5" />
                <div>
                  <span className="text-md font-medium">Films:</span>
                  <ul className="mt-1 space-y-1">
                    {char.films.map((film, i) => <li className="text-sm text-gray-400" key={i}>{film}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
