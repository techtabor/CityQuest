import { Injectable } from '@angular/core';

@Injectable()
export class TeamShareService {
  selectedTeam: any;
  selectedTeamMembers: any[];

  constructor() {}

  setTeam(t) {
    this.selectedTeam = t;
  }

  setTeamMembers(m) {
    this.selectedTeamMembers = m;
  }

  getTeamMembers() {
    return this.selectedTeamMembers;
  }

  getTeam() {
    return this.selectedTeam;
  }
}
