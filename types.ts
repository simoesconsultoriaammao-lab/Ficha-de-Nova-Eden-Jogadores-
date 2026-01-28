
export interface Character {
  id: string;
  name: string;
  photoUrl: string;
  history: string;
  personality: string;
  characterClass: string;
  profession: string;
  ac: number;
  age: number;
  alignment: string;
  size: string;
  race: string;
  subRace: string;
  racialTraits: string;
  clan: string;
  auraForm: string;
  auraHeart: string;
  abilityScoreImproves: string;
  weaponProficiency: string;
  armorProficiency: string;
  
  // Resources
  currentHp: number;
  currentMana: number;
  level: number;
  adena: number;
  xp: number;
  
  // Power Manifestations
  powers: {
    qi: number;
    haki: number;
    voo: number;
    feitico: number;
    reiatsu: number;
    nen: number;
    alquimia: number;
    cosmo: number;
    visao: number;
    chakra: number;
  };
  
  // Attributes (Status)
  attributes: {
    force: number;
    intelligence: number;
    agility: number;
    life: number;
    accuracy: number;
    mana: number;
    stealth: number;
    evasion: number;
    physicalDefense: number;
    magicDefense: number;
  };
  
  // Skills
  skills: { [key: string]: number };
  
  // Talents
  talents: {
    minor: Talent[];
    median: Talent[];
    major: Talent[];
    superior: Talent[];
  };
  
  // Items
  inventory: {
    jewelry: InventoryItem[];
    armor: InventoryItem[];
    weapon: InventoryItem[];
    general: InventoryItem[];
  };
  
  // Misc
  vulnerabilities: string;
  immunities: string;
  feelings: string;
  languages: string;
  tactics: string;
  commonAttacks: string;
  throwingAttacks: string;
  notes: string;
}

export interface Talent {
  name: string;
  level: number;
  bonus: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  weight: number;
  imageUrl: string;
}

export interface SkillDefinition {
  id: string;
  name: string;
  parentAttr: string;
  ratio: number;
  description: string;
}
