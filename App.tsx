
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Character, Talent, InventoryItem, SkillDefinition } from './types';
import { SKILL_DEFINITIONS } from './constants';
import { 
  Shield, Heart, Zap, Scroll, Sword, User, List, Briefcase, 
  Settings, Info, Save, FileDown, Plus, Trash2, Camera,
  ChevronRight, ChevronLeft, Eye, Share2, Search, Crosshair
} from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const APP_TITLE_IMAGE = "https://i.pinimg.com/736x/d9/b3/1c/d9b31ce99578785ace8402c6844abc64.jpg";

const CHARACTER_PLACEHOLDERS = [
  "https://i.pinimg.com/736x/b2/2d/ae/b22daeba19ff41d5b3c248483ecf131d.jpg",
  "https://i.pinimg.com/736x/46/35/17/4635179a0d625228f2fb8437405d5041.jpg"
];

const DEFAULT_CHARACTER = (): Character => ({
  id: Date.now().toString(),
  name: "Novo Herói",
  photoUrl: "", // Start empty to trigger carousel
  history: "",
  personality: "",
  characterClass: "",
  profession: "",
  ac: 10,
  age: 20,
  alignment: "Neutro",
  size: "Médio",
  race: "Humano",
  subRace: "",
  racialTraits: "",
  clan: "",
  auraForm: "",
  auraHeart: "",
  abilityScoreImproves: "",
  weaponProficiency: "",
  armorProficiency: "",
  currentHp: 100,
  currentMana: 100,
  level: 1,
  adena: 0,
  xp: 0,
  powers: {
    qi: 0, haki: 0, voo: 0, feitico: 0, reiatsu: 0,
    nen: 0, alquimia: 0, cosmo: 0, visao: 0, chakra: 0
  },
  attributes: {
    force: 10, intelligence: 10, agility: 10, life: 10, accuracy: 10,
    mana: 10, stealth: 10, evasion: 10, physicalDefense: 10, magicDefense: 10
  },
  skills: {},
  talents: { minor: [], median: [], major: [], superior: [] },
  inventory: { jewelry: [], armor: [], weapon: [], general: [] },
  vulnerabilities: "",
  immunities: "",
  feelings: "",
  languages: "",
  tactics: "",
  commonAttacks: "",
  throwingAttacks: "",
  notes: ""
});

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeCharId, setActiveCharId] = useState<string | null>(null);
  const [view, setView] = useState<'archive' | 'editor' | 'shared'>('archive');
  const [activeTab, setActiveTab] = useState<'personagem' | 'status' | 'pericias' | 'poderes' | 'itens' | 'anotacoes' | 'talentos'>('personagem');
  const [showItemViewer, setShowItemViewer] = useState<InventoryItem | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('nova_eden_chars');
    if (saved) {
      try {
        setCharacters(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved characters", e);
      }
    }
  }, []);

  // Save to local storage
  const saveToLocal = (updatedChars: Character[]) => {
    localStorage.setItem('nova_eden_chars', JSON.stringify(updatedChars));
    setCharacters(updatedChars);
  };

  const activeChar = useMemo(() => 
    characters.find(c => c.id === activeCharId) || null
  , [characters, activeCharId]);

  const updateCharacter = (updates: Partial<Character>) => {
    if (!activeCharId) return;
    const newChars = characters.map(c => 
      c.id === activeCharId ? { ...c, ...updates } : c
    );
    saveToLocal(newChars);
  };

  const createCharacter = () => {
    const newChar = DEFAULT_CHARACTER();
    const newChars = [...characters, newChar];
    saveToLocal(newChars);
    setActiveCharId(newChar.id);
    setView('editor');
  };

  const deleteCharacter = (id: string) => {
    if(!confirm("Tem certeza que deseja apagar esta lenda?")) return;
    const newChars = characters.filter(c => c.id !== id);
    saveToLocal(newChars);
    if (activeCharId === id) setActiveCharId(null);
  };

  const exportAsPDF = () => {
    window.print();
  };

  const shareCharacter = () => {
    if (!activeChar) return;
    const charData = btoa(JSON.stringify(activeChar));
    const url = `${window.location.origin}/#/share/${charData}`;
    navigator.clipboard.writeText(url);
    alert("Link de compartilhamento copiado!");
  };

  if (view === 'archive') {
    return (
      <>
        <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fadeIn">
        <header className="flex flex-col items-center mb-12">
          <img src={APP_TITLE_IMAGE} alt="Nova Eden" className="w-full max-w-2xl rounded-lg shadow-2xl mb-8 border border-yellow-500/30" />
          <h1 className="text-4xl md:text-5xl font-black text-center text-yellow-500 medieval uppercase tracking-widest mb-4">Heróis de Outrora</h1>
          <button 
            onClick={createCharacter}
            className="bg-red-800 hover:bg-red-700 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg border border-yellow-500/50"
          >
            <Plus size={24} /> Criar Nova Ficha
          </button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characters.map(char => (
            <div key={char.id} className="glass-panel group relative overflow-hidden rounded-xl border-2 border-transparent hover:border-yellow-500 transition-all">
              <div 
                className="aspect-[836/1253] bg-cover bg-center cursor-pointer bg-gray-900"
                style={{ backgroundImage: `url(${char.photoUrl || CHARACTER_PLACEHOLDERS[0]})` }}
                onClick={() => { setActiveCharId(char.id); setView('editor'); }}
              />
              <div className="p-3 bg-black/80 absolute bottom-0 w-full flex justify-between items-center backdrop-blur-sm">
                <span className="medieval text-lg text-white font-bold truncate">{char.name}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteCharacter(char.id); }}
                  className="text-red-500 hover:text-red-400 p-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {characters.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400 text-xl medieval italic">
              Nenhuma lenda foi escrita ainda...
            </div>
          )}
        </div>
        </div>
        <SpeedInsights />
      </>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <nav className="sticky top-0 z-50 glass-panel border-b border-yellow-600/30 p-4 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('archive')} className="text-yellow-500 hover:text-yellow-400 flex items-center gap-1 medieval font-bold">
              <ChevronLeft /> Voltar
            </button>
            <img src={APP_TITLE_IMAGE} alt="Header" className="h-10 rounded border border-yellow-500/20 hidden md:block" />
            <h2 className="text-xl font-bold medieval text-yellow-500 hidden lg:block">Ficha de personagens de Nova Eden</h2>
          </div>
          
          <div className="flex gap-2">
            <button onClick={shareCharacter} className="bg-blue-800 hover:bg-blue-700 p-2 rounded text-white" title="Compartilhar">
              <Share2 size={20} />
            </button>
            <button onClick={exportAsPDF} className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-white" title="Exportar PDF">
              <FileDown size={20} />
            </button>
            <button onClick={() => updateCharacter({})} className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded text-white flex items-center gap-2 medieval">
              <Save size={18} /> Salvar
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-800 pb-2 overflow-x-auto print:hidden">
          {[
            { id: 'personagem', label: 'Personagem', icon: User },
            { id: 'status', label: 'Status', icon: Shield },
            { id: 'pericias', label: 'Perícias & Talentos', icon: Scroll },
            { id: 'poderes', label: 'Manifestações de Poder', icon: Zap },
            { id: 'itens', label: 'Itens & Acessórios', icon: Sword },
            { id: 'talentos', label: 'Árvore de Talentos', icon: List },
            { id: 'anotacoes', label: 'Anotações', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all medieval text-sm md:text-base border-b-2 ${
                activeTab === tab.id 
                ? 'bg-yellow-900/40 text-yellow-400 border-yellow-400' 
                : 'text-gray-400 border-transparent hover:bg-gray-800/50'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-fadeIn">
          {activeChar && (
            <>
              {activeTab === 'personagem' && <CharacterTab char={activeChar} update={updateCharacter} />}
              {activeTab === 'status' && <StatusTab char={activeChar} update={updateCharacter} />}
              {activeTab === 'pericias' && <SkillsTab char={activeChar} update={updateCharacter} />}
              {activeTab === 'poderes' && <PowersTab char={activeChar} update={updateCharacter} />}
              {activeTab === 'itens' && <ItemsTab char={activeChar} update={updateCharacter} setViewer={setShowItemViewer} />}
              {activeTab === 'talentos' && <TalentTreeTab char={activeChar} update={updateCharacter} />}
              {activeTab === 'anotacoes' && <NotesTab char={activeChar} update={updateCharacter} />}
            </>
          )}
        </div>
      </main>

      {showItemViewer && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowItemViewer(null)}>
          <div className="glass-panel max-w-[700px] w-full p-1 relative rounded-xl border-2 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.3)]" onClick={e => e.stopPropagation()}>
            <button className="absolute -top-4 -right-4 bg-red-600 p-2 rounded-full text-white shadow-xl z-10 hover:bg-red-500 transition-colors" onClick={() => setShowItemViewer(null)}>
              <Trash2 size={24} />
            </button>
            <div className="relative w-[700px] h-[900px] max-w-full max-h-[80vh] overflow-hidden rounded-lg mx-auto">
              <img src={showItemViewer.imageUrl} alt={showItemViewer.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                <h3 className="text-4xl medieval text-yellow-500 text-center drop-shadow-lg mb-2">{showItemViewer.name}</h3>
                <p className="text-center text-gray-300 font-bold text-lg">Peso: {showItemViewer.weight} kg</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <SpeedInsights />
    </div>
  );
};

// --- TABS COMPONENTS ---

const CharacterTab: React.FC<{ char: Character, update: (u: Partial<Character>) => void }> = ({ char, update }) => {
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    if (!char.photoUrl) {
      const interval = setInterval(() => {
        setPlaceholderIdx(prev => (prev + 1) % CHARACTER_PLACEHOLDERS.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [char.photoUrl]);

  const totalPowerLevel = (Object.values(char.powers) as number[]).reduce((a, b) => a + b, 0);
  const maxHp = 100 + (char.attributes.life * 5) + (totalPowerLevel * 100);
  const maxMana = 100 + (char.attributes.mana * 5) + (totalPowerLevel * 100);
  const totalWeight = (Object.values(char.inventory).flat() as InventoryItem[]).reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
  const weightLimit = 100 + (char.attributes.force * 2);

  const [calcValues, setCalcValues] = useState({ damage: 0, heal: 0, manaCost: 0, manaRestore: 0, type: 'fisico' as 'fisico' | 'magico' | 'verdadeiro' });

  const applyDamage = () => {
    let finalDmg = calcValues.damage;
    if (calcValues.type === 'fisico') finalDmg = Math.max(0, finalDmg - char.attributes.physicalDefense);
    if (calcValues.type === 'magico') finalDmg = Math.max(0, finalDmg - char.attributes.magicDefense);
    update({ currentHp: Math.max(0, char.currentHp - finalDmg) });
  };

  const applyHeal = () => {
    update({ currentHp: Math.min(maxHp, char.currentHp + calcValues.heal) });
  };

  const applyManaCost = () => {
    update({ currentMana: Math.max(0, char.currentMana - calcValues.manaCost) });
  };

  const applyManaRestore = () => {
    update({ currentMana: Math.min(maxMana, char.currentMana + calcValues.manaRestore) });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 space-y-4">
        <div className="glass-panel p-2 rounded-xl border border-yellow-500/30 shadow-2xl overflow-hidden relative group">
          <div 
            className="aspect-[836/1253] bg-cover bg-center rounded transition-all duration-1000 ease-in-out"
            style={{ backgroundImage: `url(${char.photoUrl || CHARACTER_PLACEHOLDERS[placeholderIdx]})` }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <label className="cursor-pointer bg-black/60 p-4 rounded-full border border-yellow-500 text-yellow-500 hover:scale-110 transition-transform">
                <Camera size={32} />
                <input type="file" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => update({ photoUrl: ev.target?.result as string });
                    reader.readAsDataURL(file);
                  }
                }} />
             </label>
          </div>
        </div>
        
        <div className="glass-panel p-4 rounded-lg space-y-4">
           <div>
             <label className="block text-xs uppercase text-yellow-500 font-bold mb-1">Nome do Personagem</label>
             <input value={char.name} onChange={e => update({ name: e.target.value })} className="rpg-input w-full text-xl medieval" />
           </div>
           <div className="grid grid-cols-2 gap-2">
             <div>
               <label className="block text-xs text-yellow-500">Nível de Poder (Calc)</label>
               <div className="rpg-input bg-red-900/20 text-center font-bold">{totalPowerLevel}</div>
             </div>
             <div>
               <label className="block text-xs text-yellow-500">Mochila (kg)</label>
               <div className={`rpg-input text-center font-bold ${totalWeight > weightLimit ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                 {totalWeight} / {weightLimit}
               </div>
               {totalWeight > weightLimit && <p className="text-[10px] text-red-500 text-center mt-1 uppercase font-black">Seu limite de peso na mochila foi atingido!</p>}
             </div>
           </div>
        </div>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-4 rounded-xl border border-red-500/30">
            <div className="flex justify-between items-center mb-2">
              <h3 className="medieval text-red-500 flex items-center gap-2"><Heart /> Pontos de Vida (PV)</h3>
              <span className="text-xl font-bold">{char.currentHp} / {maxHp}</span>
            </div>
            <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden border border-red-900">
               <div className="bg-red-600 h-full transition-all duration-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{ width: `${(char.currentHp / maxHp) * 100}%` }} />
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
               <div className="space-y-1">
                 <input type="number" placeholder="Dano" className="rpg-input w-full" onChange={e => setCalcValues({...calcValues, damage: Number(e.target.value)})} />
                 <div className="flex gap-1">
                   <select className="bg-black text-[10px] p-1 border border-gray-700 rounded" value={calcValues.type} onChange={e => setCalcValues({...calcValues, type: e.target.value as any})}>
                     <option value="fisico">Físico</option>
                     <option value="magico">Mágico</option>
                     <option value="verdadeiro">Verdadeiro</option>
                   </select>
                   <button onClick={applyDamage} className="bg-red-700 hover:bg-red-600 text-[10px] px-2 py-1 rounded flex-1 uppercase font-bold transition-colors">DANO</button>
                 </div>
               </div>
               <div className="space-y-1 relative">
                 <input type="number" placeholder="Cura" className="rpg-input w-full mb-1" onChange={e => setCalcValues({...calcValues, heal: Number(e.target.value)})} />
                 <button onClick={applyHeal} className="bg-green-700 hover:bg-green-600 text-[10px] px-2 py-1 rounded w-full uppercase font-bold transition-colors">RESTAURAR</button>
               </div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-blue-500/30">
            <div className="flex justify-between items-center mb-2">
              <h3 className="medieval text-blue-500 flex items-center gap-2"><Zap /> Pontos de Mana (PM)</h3>
              <span className="text-xl font-bold">{char.currentMana} / {maxMana}</span>
            </div>
            <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden border border-blue-900">
               <div className="bg-blue-600 h-full transition-all duration-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]" style={{ width: `${(char.currentMana / maxMana) * 100}%` }} />
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
               <div className="space-y-1">
                 <input type="number" placeholder="Custo" className="rpg-input w-full mb-1" onChange={e => setCalcValues({...calcValues, manaCost: Number(e.target.value)})} />
                 <button onClick={applyManaCost} className="bg-blue-900 hover:bg-blue-800 text-[10px] px-2 py-1 rounded w-full uppercase font-bold transition-colors">GASTAR</button>
               </div>
               <div className="space-y-1">
                 <input type="number" placeholder="Restaurar" className="rpg-input w-full mb-1" onChange={e => setCalcValues({...calcValues, manaRestore: Number(e.target.value)})} />
                 <button onClick={applyManaRestore} className="bg-cyan-700 hover:bg-cyan-600 text-[10px] px-2 py-1 rounded w-full uppercase font-bold transition-colors">RESTAURAR</button>
               </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl grid grid-cols-2 md:grid-cols-3 gap-6">
           <Field label="Personalidade" value={char.personality} update={v => update({ personality: v })} />
           <Field label="Classe" value={char.characterClass} update={v => update({ characterClass: v })} />
           <Field label="Profissão" value={char.profession} update={v => update({ profession: v })} />
           <Field label="Raças & Sub-Raças" value={`${char.race}${char.subRace ? ' ('+char.subRace+')' : ''}`} update={v => update({ race: v })} />
           <Field label="Tendência" value={char.alignment} update={v => update({ alignment: v })} />
           <Field label="Idade" value={char.age} type="number" update={v => update({ age: Number(v) })} />
           <Field label="Tamanho" value={char.size} update={v => update({ size: v })} />
           <Field label="Clã" value={char.clan} update={v => update({ clan: v })} />
           <Field label="Traços Raciais" value={char.racialTraits} update={v => update({ racialTraits: v })} />
           <Field label="Forma/Coração da Aura" value={char.auraForm} update={v => update({ auraForm: v })} />
           <Field label="Aprimoramento Valor Habilidade" value={char.abilityScoreImproves} update={v => update({ abilityScoreImproves: v })} />
           <Field label="Proficiência Armamento" value={char.weaponProficiency} update={v => update({ weaponProficiency: v })} />
           <Field label="Proficiência Armadura" value={char.armorProficiency} update={v => update({ armorProficiency: v })} />
           <Field label="Adena ($)" value={char.adena} type="number" update={v => update({ adena: Number(v) })} />
        </div>

        <div className="glass-panel p-6 rounded-xl space-y-4">
           <h3 className="medieval text-yellow-500 border-b border-yellow-500/30 pb-2">História do Personagem (Máx 500 letras)</h3>
           <textarea 
             maxLength={500}
             value={char.history}
             onChange={e => update({ history: e.target.value })}
             className="w-full bg-black/40 p-4 border border-yellow-900/30 rounded h-32 focus:border-yellow-500 outline-none text-sm leading-relaxed italic custom-scrollbar"
             placeholder="Era uma vez nas terras de Nova Eden..."
           />
           <div className="text-right text-xs text-gray-500 font-bold uppercase">{char.history.length}/500 letras</div>
        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string, value: any, type?: string, update: (v: string) => void }> = ({ label, value, type = 'text', update }) => (
  <div>
    <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">{label}</label>
    <input type={type} value={value} onChange={e => update(e.target.value)} className="rpg-input w-full text-sm" />
  </div>
);

const StatusTab: React.FC<{ char: Character, update: (u: Partial<Character>) => void }> = ({ char, update }) => {
  const [activeDesc, setActiveDesc] = useState<string | null>(null);

  const stats = [
    { key: 'force', label: 'Força', icon: Sword, desc: 'Força básica para o movimento e transporte de objetos.' },
    { key: 'intelligence', label: 'Inteligência', icon: Scroll, desc: 'Acuidade mental e habilidade analítica.' },
    { key: 'agility', label: 'Agilidade', icon: Zap, desc: 'Reflexos, equilíbrio e estabilidade física.' },
    { key: 'life', label: 'Vida', icon: Heart, desc: 'Saúde, resistência e vitalidade.' },
    { key: 'accuracy', label: 'Acuracidade', icon: Crosshair, desc: 'Capacidade de acertar alvos com precisão.' },
    { key: 'mana', label: 'Mana', icon: Zap, desc: 'Reserva de energia vital ou mágica.' },
    { key: 'stealth', label: 'Furtividade', icon: Eye, desc: 'Capacidade de agir sem ser detectado e influenciar outros.' },
    { key: 'evasion', label: 'Evasão', icon: Shield, desc: 'Vigilância, intuição e escape de ataques.' },
    { key: 'physicalDefense', label: 'Defesa Física', icon: Shield, desc: 'Bloqueio de golpes físicos e proteção de aliados.' },
    { key: 'magicDefense', label: 'Defesa Mágica', icon: Shield, desc: 'Proteção contra encantamentos e danos psíquicos.' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map(s => (
        <div key={s.key} className="glass-panel p-4 rounded-xl border border-yellow-500/20 hover:border-yellow-500/50 transition-all flex flex-col items-center group relative">
          <button onClick={() => setActiveDesc(activeDesc === s.key ? null : s.key)} className="absolute top-2 right-2 text-yellow-500/50 hover:text-yellow-500 z-20">
            <Info size={16} />
          </button>
          <s.icon size={32} className="text-yellow-500 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="medieval text-sm font-bold mb-2 uppercase">{s.label}</h4>
          <input 
            type="number" 
            value={char.attributes[s.key as keyof typeof char.attributes]} 
            onChange={e => update({ attributes: { ...char.attributes, [s.key]: Number(e.target.value) } })}
            className="rpg-input text-center w-20 text-xl font-bold"
          />
          {activeDesc === s.key && (
            <div className="absolute top-full mt-2 left-0 right-0 z-50 p-4 bg-[#1a1a1a] border-2 border-yellow-500 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-xs leading-relaxed animate-fadeIn before:content-[''] before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-yellow-500">
              <div className="bg-black/40 p-2 border border-yellow-900/30 rounded">
                <p className="text-yellow-400 font-bold uppercase mb-1 border-b border-yellow-900/30 pb-1">{s.label}</p>
                <p className="text-gray-200 italic">{s.desc}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const SkillsTab: React.FC<{ char: Character, update: (u: Partial<Character>) => void }> = ({ char, update }) => {
  const [info, setInfo] = useState<SkillDefinition | null>(null);
  const calculateBonus = (points: number, ratio: number) => Math.floor(points / ratio);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 h-[600px] overflow-y-auto custom-scrollbar pr-4">
          {SKILL_DEFINITIONS.map(skill => {
            const points = char.skills[skill.id] || 0;
            const bonus = calculateBonus(points, skill.ratio);
            return (
              <div key={skill.id} className="flex items-center gap-3 bg-black/40 p-3 rounded-lg border border-gray-800 hover:border-yellow-900/50 transition-colors">
                <button onClick={() => setInfo(skill)} className="text-yellow-500 hover:text-yellow-400">
                  <Info size={16} />
                </button>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-bold">{skill.parentAttr}</p>
                  <p className="text-sm font-bold medieval">{skill.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500">PONTOS DE TREINO</p>
                    <input 
                      type="number" 
                      value={points} 
                      onChange={e => update({ skills: { ...char.skills, [skill.id]: Number(e.target.value) } })}
                      className="rpg-input w-16 text-center"
                    />
                  </div>
                  <div className="text-center bg-yellow-900/20 px-3 py-1 rounded border border-yellow-600/30">
                    <p className="text-[10px] text-yellow-500">BÔNUS</p>
                    <p className="font-bold text-yellow-400">+{bonus}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {info && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setInfo(null)}>
          <div className="glass-panel max-w-md w-full p-1 rounded-xl border-2 border-yellow-500 animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-yellow-900/50">
               <h3 className="text-2xl medieval text-yellow-500 mb-4 border-b border-yellow-500/30 pb-2">{info.name}</h3>
               <div className="bg-black/60 p-4 border border-yellow-900/20 rounded mb-6">
                 <p className="text-gray-200 leading-relaxed italic">"{info.description}"</p>
               </div>
               <div className="flex justify-between items-center text-xs font-black border-t border-yellow-900/30 pt-4 bg-yellow-900/10 px-3 py-2 rounded">
                 <span className="text-gray-400 uppercase">Atributo Base: <span className="text-yellow-500">{info.parentAttr}</span></span>
                 <span className="text-yellow-600">Multiplicador: <span className="text-yellow-400">+1 / {info.ratio} pts</span></span>
               </div>
               <button onClick={() => setInfo(null)} className="w-full mt-6 bg-yellow-800 hover:bg-yellow-700 text-white py-2 rounded medieval transition-colors uppercase font-bold text-sm border border-yellow-600/50">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PowersTab: React.FC<{ char: Character, update: (u: Partial<Character>) => void }> = ({ char, update }) => {
  const powerList = [
    { key: 'qi', label: 'Qi' },
    { key: 'haki', label: 'Haki' },
    { key: 'voo', label: 'Voo' },
    { key: 'feitico', label: 'Feitiço' },
    { key: 'reiatsu', label: 'Reiatsu' },
    { key: 'nen', label: 'Nen' },
    { key: 'alquimia', label: 'Alquimia' },
    { key: 'cosmo', label: 'Cosmo' },
    { key: 'visao', label: 'Visão' },
    { key: 'chakra', label: 'Chakra' },
  ];

  return (
    <div className="glass-panel p-8 rounded-xl grid grid-cols-2 md:grid-cols-5 gap-6">
      {powerList.map(p => (
        <div key={p.key} className="text-center space-y-2">
          <label className="block medieval text-yellow-500 text-lg uppercase font-black">{p.label}</label>
          <input 
            type="number" 
            value={char.powers[p.key as keyof typeof char.powers]} 
            onChange={e => update({ powers: { ...char.powers, [p.key]: Number(e.target.value) } })}
            className="rpg-input w-24 h-24 text-center text-4xl font-black bg-yellow-900/10 border-4 border-yellow-600 rounded-xl transition-all hover:bg-yellow-900/20 focus:border-yellow-400"
          />
        </div>
      ))}
    </div>
  );
};

const ItemsTab: React.FC<{ char: Character, update: (u: Partial<Character>) => void, setViewer: (i: InventoryItem) => void }> = ({ char, update, setViewer }) => {
  const [activeSubTab, setActiveSubTab] = useState<'weapon' | 'armor' | 'jewelry' | 'general'>('weapon');
  const [newItemData, setNewItemData] = useState<{ name: string, weight: number, imageUrl: string }>({ name: '', weight: 0, imageUrl: '' });
  const [isAdding, setIsAdding] = useState(false);

  // Fill Border Class (Light brown 75% opacity)
  const fillBorderClass = "bg-[#C4A484]/75 border-4 border-[#8B4513]/50 rounded-xl p-6 shadow-[inset_0_0_15px_rgba(0,0,0,0.4)]";
  const subTabContainerClass = "bg-[#C4A484]/75 border-2 border-[#8B4513]/50 rounded-lg p-2 flex flex-wrap gap-2 shadow-md mb-4";

  const handleAddItem = () => {
    if (!newItemData.name || !newItemData.imageUrl) {
        alert("Por favor, preencha o nome e selecione uma imagem.");
        return;
    }
    const newItem: InventoryItem = { 
        id: Date.now().toString(), 
        name: newItemData.name, 
        weight: newItemData.weight, 
        imageUrl: newItemData.imageUrl 
    };
    update({ inventory: { ...char.inventory, [activeSubTab]: [...char.inventory[activeSubTab], newItem] } });
    setNewItemData({ name: '', weight: 0, imageUrl: '' });
    setIsAdding(false);
  };

  const removeItem = (id: string) => {
    update({ inventory: { ...char.inventory, [activeSubTab]: char.inventory[activeSubTab].filter(i => i.id !== id) } });
  };

  return (
    <div className="space-y-6">
      {/* Tab Selectors with Fill Border */}
      <div className={subTabContainerClass}>
        <button onClick={() => setActiveSubTab('weapon')} className={`px-4 py-2 medieval uppercase text-xs font-black transition-all rounded ${activeSubTab === 'weapon' ? 'bg-black text-yellow-500 shadow-inner' : 'text-black hover:bg-black/10'}`}>Arma Equipada</button>
        <button onClick={() => setActiveSubTab('armor')} className={`px-4 py-2 medieval uppercase text-xs font-black transition-all rounded ${activeSubTab === 'armor' ? 'bg-black text-yellow-500 shadow-inner' : 'text-black hover:bg-black/10'}`}>Set de Armaduras</button>
        <button onClick={() => setActiveSubTab('jewelry')} className={`px-4 py-2 medieval uppercase text-xs font-black transition-all rounded ${activeSubTab === 'jewelry' ? 'bg-black text-yellow-500 shadow-inner' : 'text-black hover:bg-black/10'}`}>Set de Joias</button>
        <button onClick={() => setActiveSubTab('general')} className={`px-4 py-2 medieval uppercase text-xs font-black transition-all rounded ${activeSubTab === 'general' ? 'bg-black text-yellow-500 shadow-inner' : 'text-black hover:bg-black/10'}`}>Itens em Geral</button>
      </div>

      {/* Main Container with Fill Border */}
      <div className={fillBorderClass}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <div className="bg-black/60 p-2 rounded border border-yellow-500/30 flex items-center justify-center text-yellow-500" title="Visualizador de Itens">
                  <Search size={24} />
                </div>
                <h3 className="text-3xl medieval text-black font-black uppercase tracking-tighter drop-shadow-sm">Itens & Acessórios</h3>
            </div>
            {!isAdding && (
                <button onClick={() => setIsAdding(true)} className="bg-red-900/90 hover:bg-red-800 px-8 py-3 rounded-full medieval text-white flex items-center gap-2 shadow-2xl transition-all hover:scale-105 border border-yellow-500/30">
                    <Plus size={20} /> Adicionar Item
                </button>
            )}
          </div>

          {isAdding && (
            <div className="glass-panel p-6 rounded-xl border-2 border-yellow-500/50 animate-fadeIn space-y-4 shadow-2xl mb-6">
                <h4 className="medieval text-yellow-500 font-bold border-b border-yellow-500/20 pb-2">Novo Card de Item (700x900)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase">Nome do Item</label>
                        <input value={newItemData.name} onChange={e => setNewItemData({...newItemData, name: e.target.value})} className="rpg-input w-full" placeholder="Ex: Elmo de Mitril" />
                    </div>
                    <div>
                        <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase">Peso do Item (kg)</label>
                        <input type="number" value={newItemData.weight} onChange={e => setNewItemData({...newItemData, weight: Number(e.target.value)})} className="rpg-input w-full" />
                    </div>
                    <div>
                        <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase">Imagem do Item</label>
                        <label className="cursor-pointer bg-yellow-900/30 hover:bg-yellow-800/50 p-2 rounded border border-yellow-700 text-xs flex items-center justify-center gap-2 transition-colors h-[38px]">
                            <Camera size={16} /> {newItemData.imageUrl ? "✓ Imagem Selecionada" : "Fazer Upload da Imagem"}
                            <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => setNewItemData({...newItemData, imageUrl: ev.target?.result as string});
                                    reader.readAsDataURL(file);
                                }
                            }} />
                        </label>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors medieval text-sm uppercase">CANCELAR</button>
                    <button onClick={handleAddItem} className="bg-yellow-600 hover:bg-yellow-500 px-8 py-2 rounded text-white font-bold transition-all shadow-lg medieval text-sm uppercase">SALVAR ITEM</button>
                </div>
            </div>
          )}

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {char.inventory[activeSubTab].map(item => (
              <div key={item.id} className="glass-panel group relative rounded-xl overflow-hidden border border-yellow-500/20 hover:border-yellow-500 transition-all transform hover:-translate-y-2 shadow-2xl">
                <div className="absolute top-2 left-2 z-10">
                  <button 
                    onClick={() => setViewer(item)} 
                    className="bg-black/70 p-2 rounded-full text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all shadow-md" 
                    title="Visualizar em tamanho real (700x900)"
                  >
                    <Search size={20} />
                  </button>
                </div>
                <button 
                  onClick={() => removeItem(item.id)} 
                  className="absolute top-2 right-2 z-10 bg-red-600/60 p-2 rounded-full text-white hover:bg-red-600 transition-all shadow-md"
                >
                  <Trash2 size={20} />
                </button>
                <div className="aspect-[700/900] bg-cover bg-center bg-black/40" style={{ backgroundImage: `url(${item.imageUrl})` }} />
                <div className="p-3 bg-black/80 flex flex-col items-center border-t border-yellow-500/20">
                  <span className="medieval text-sm font-bold truncate w-full text-center text-white">{item.name}</span>
                  <span className="text-[10px] text-yellow-600 font-black tracking-widest uppercase mt-1">Peso: {item.weight} kg</span>
                </div>
              </div>
            ))}
            {char.inventory[activeSubTab].length === 0 && !isAdding && (
              <div className="col-span-full text-center py-20 animate-pulse">
                <div className="bg-black/40 p-1 rounded inline-block border border-yellow-900/20">
                    <div className="bg-[#C4A484]/75 border-4 border-[#8B4513] px-12 py-10 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                        <p className="medieval italic text-2xl text-black font-black uppercase tracking-widest drop-shadow-md">
                            Sua mochila parece vazia nesta categoria...
                        </p>
                    </div>
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

const TalentTreeTab: React.FC<{ char: Character, update: (u: Partial<Character>) => void }> = ({ char, update }) => {
  const categories = [
    { key: 'minor', label: 'Talento Menor', color: 'bg-green-600', text: 'text-green-400' },
    { key: 'median', label: 'Talento Mediano', color: 'bg-blue-600', text: 'text-blue-400' },
    { key: 'major', label: 'Talento Maior', color: 'bg-purple-600', text: 'text-purple-400' },
    { key: 'superior', label: 'Talento Superior', color: 'bg-red-600', text: 'text-red-400' },
  ];

  const addTalent = (cat: string) => {
    const name = prompt("Nome do Talento:");
    if (!name) return;
    const levelInput = prompt("Nível:");
    const level = Number(levelInput) || 0;
    const bonus = prompt("Bônus:");
    const updated = { ...char.talents, [cat]: [...char.talents[cat as keyof typeof char.talents], { name, level, bonus }] };
    update({ talents: updated });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {categories.map(cat => (
        <div key={cat.key} className="glass-panel p-6 rounded-xl space-y-4 border-l-4 border-l-transparent hover:border-l-current transition-all" style={{ borderLeftColor: cat.color.replace('bg-', '') }}>
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <h3 className={`text-xl medieval font-black uppercase ${cat.text}`}>{cat.label}</h3>
            <button onClick={() => addTalent(cat.key)} className={`${cat.color} text-white p-2 rounded-full hover:scale-110 transition-transform shadow-lg`}>
              <Plus size={18} />
            </button>
          </div>
          <div className="space-y-3">
            {char.talents[cat.key as keyof typeof char.talents].map((t, idx) => (
              <div key={idx} className="flex justify-between items-center bg-black/40 p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-all">
                <div className="flex-1">
                  <p className="font-bold medieval text-white">{t.name}</p>
                  <div className="flex gap-3 mt-1 bg-black/20 p-1 rounded border border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase font-black">Nível {t.level}</span>
                    <span className={`text-[10px] uppercase font-black ${cat.text}`}>Bônus: {t.bonus}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const filtered = char.talents[cat.key as keyof typeof char.talents].filter((_, i) => i !== idx);
                    update({ talents: { ...char.talents, [cat.key]: filtered } });
                  }} 
                  className="text-red-500 hover:text-red-400 p-2 ml-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {char.talents[cat.key as keyof typeof char.talents].length === 0 && (
              <p className="text-gray-700 text-xs italic text-center py-4">Sem talentos adquiridos.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const NotesTab: React.FC<{ char: Character, update: (u: Partial<Character>) => void }> = ({ char, update }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <NoteBlock title="Vantagens e Desvantagens" value={char.vulnerabilities} update={v => update({ vulnerabilities: v })} />
        <NoteBlock title="🛡️ Imunidades de Condição" value={char.immunities} update={v => update({ immunities: v })} />
        <NoteBlock title="👀 Sentimentos" value={char.feelings} update={v => update({ feelings: v })} />
        <NoteBlock title="🗣️ Idiomas" value={char.languages} update={v => update({ languages: v })} />
      </div>
      <div className="space-y-6">
        <NoteBlock title="2ª. Táticas em Equipe" value={char.tactics} update={v => update({ tactics: v })} />
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h3 className="medieval text-yellow-500 border-b border-yellow-500/30 pb-2 font-black uppercase text-sm">Ações & Combate</h3>
          <Field label="Ataques Comuns" value={char.commonAttacks} update={v => update({ commonAttacks: v })} />
          <Field label="Arremesso" value={char.throwingAttacks} update={v => update({ throwingAttacks: v })} />
        </div>
        <NoteBlock title="Anotações Gerais (Profissões, Treinamentos, etc.)" value={char.notes} update={v => update({ notes: v })} />
      </div>
    </div>
  );
};

const NoteBlock: React.FC<{ title: string, value: string, update: (v: string) => void }> = ({ title, value, update }) => (
  <div className="glass-panel p-6 rounded-xl space-y-4">
    <h3 className="medieval text-yellow-500 border-b border-yellow-500/30 pb-2 uppercase text-sm font-black">{title}</h3>
    <div className="bg-[#1a1a1a] p-2 rounded border border-yellow-900/20">
      <textarea 
        value={value}
        onChange={e => update(e.target.value)}
        className="w-full bg-black/40 p-4 border border-yellow-900/30 rounded h-32 focus:border-yellow-500 outline-none text-sm italic custom-scrollbar leading-relaxed text-gray-200"
        placeholder="..."
      />
    </div>
  </div>
);

export default App;
