export interface Player {
    _id: string;
    name: string;
  }

  // types/tournament.ts
export interface Tournament {
  _id: string;
  name: string;
  location: string;
  description?: string;
  format: string;
  type: string;
  startDate: string;
  endDate?: string;
  teams: string[];
  matches?: string[];
  standings?: {
    team: string;
    matchesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
    points: number;
    netRunRate: number;
  }[];
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}
  export interface Team {
    _id: string;
    name: string;
    players: Player[];
  }
  

  export interface TeamRef {
    _id: string;
    name: string;
  }
  
  export interface Match {
    format: ReactNode;
    _id: string;
    date: string;
    venue: string;
    teams: TeamRef[];
    status: 'upcoming' | 'ongoing' | 'completed';
    result?: string;
  }
  // export interface Match {
  //   _id: string;
  //   teams: Team[];
  //   venue: string;
  //   date: string;
  // }
  
  export interface PlayerStats {
    runs: number;
    balls: number;
  }
  
  export interface BowlerStatsModel extends PlayerStats {
    overs: number;
  }
  
  export interface BallUpdatePayload {
    matchId: string;
    battingTeamId: string;
    strikerId: string;
    nonStrikerId: string;
    bowlerId: string;
    runs: number;
    ballType: string;
    isWicket: boolean;
    newBatterId: string | null;
  }
  
  export interface BallTypeOption {
    value: string;
    label: string;
  }