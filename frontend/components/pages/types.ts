export interface Player {
    _id: string;
    name: string;
  }
  
  export interface Team {
    _id: string;
    name: string;
    players: Player[];
  }
  
  export interface Match {
    _id: string;
    teams: Team[];
    venue: string;
    date: string;
  }
  
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