import { createClient } from '@supabase/supabase-js';
// Replace with your Supabase URL and anon key
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export type Team = {
  id: number;
  name: string;
  logoUrl: string;
};
export type Match = {
  id: number;
  home: string;
  away: string;
  homeTeam: Team;
  awayTeam: Team;
  ht: string; // Half-time score
  ft: string; // Full-time score
  btts: boolean; // Both teams to score
  comeback: boolean;
  homeGoals: number;
  awayGoals: number;
};
export const fetchTeams = async (): Promise<Team[]> => {
  // In a real implementation, this would fetch from Supabase
  // For now, return mock data
  return [{
    id: 1,
    name: 'Ferencváros',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Ferencv%C3%A1rosi_TC.svg'
  }, {
    id: 2,
    name: 'Újpest FC',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/51/%C3%9Ajpest_FC.svg'
  }, {
    id: 3,
    name: 'Debrecen',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4f/Debreceni_VSC.svg'
  }, {
    id: 4,
    name: 'Puskás Akadémia',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8d/Pusk%C3%A1s_Akad%C3%A9mia_FC.svg'
  }, {
    id: 5,
    name: 'MTK Budapest',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/21/MTK_Budapest_FC_logo.svg'
  }];
};
export const fetchMatches = async (filters: {
  home?: string;
  away?: string;
  btts?: boolean;
  comeback?: boolean;
}): Promise<Match[]> => {
  // In a real implementation, this would fetch from Supabase with filters
  // For now, return mock data
  const teams = await fetchTeams();
  // Generate some mock matches
  const matches: Match[] = [];
  for (let i = 0; i < 100; i++) {
    const homeTeamIndex = Math.floor(Math.random() * teams.length);
    let awayTeamIndex = Math.floor(Math.random() * teams.length);
    // Ensure away team is different from home team
    while (awayTeamIndex === homeTeamIndex) {
      awayTeamIndex = Math.floor(Math.random() * teams.length);
    }
    const homeGoals = Math.floor(Math.random() * 5);
    const awayGoals = Math.floor(Math.random() * 5);
    const htHomeGoals = Math.min(homeGoals, Math.floor(Math.random() * 3));
    const htAwayGoals = Math.min(awayGoals, Math.floor(Math.random() * 3));
    const btts = homeGoals > 0 && awayGoals > 0;
    // Determine if there was a comeback
    const htWinner = htHomeGoals > htAwayGoals ? 'home' : htAwayGoals > htHomeGoals ? 'away' : 'draw';
    const ftWinner = homeGoals > awayGoals ? 'home' : awayGoals > homeGoals ? 'away' : 'draw';
    const comeback = htWinner !== 'draw' && ftWinner !== 'draw' && htWinner !== ftWinner;
    matches.push({
      id: i + 1,
      home: teams[homeTeamIndex].name,
      away: teams[awayTeamIndex].name,
      homeTeam: teams[homeTeamIndex],
      awayTeam: teams[awayTeamIndex],
      ht: `${htHomeGoals} - ${htAwayGoals}`,
      ft: `${homeGoals} - ${awayGoals}`,
      btts,
      comeback,
      homeGoals,
      awayGoals
    });
  }
  // Apply filters if provided
  let filteredMatches = matches;
  if (filters.home) {
    filteredMatches = filteredMatches.filter(match => match.home === filters.home);
  }
  if (filters.away) {
    filteredMatches = filteredMatches.filter(match => match.away === filters.away);
  }
  if (filters.btts !== undefined) {
    filteredMatches = filteredMatches.filter(match => match.btts === filters.btts);
  }
  if (filters.comeback !== undefined) {
    filteredMatches = filteredMatches.filter(match => match.comeback === filters.comeback);
  }
  return filteredMatches;
};