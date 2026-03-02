import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AreaAgentService } from '../../../../core/services/area-agents.service';
import { AreaAgent } from '../../../../core/models/area-agent.model';

@Component({
  selector: 'app-area-agents',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './area-agent-list.html',
  styleUrls: ['./area-agent-list.scss']
})
export class AreaAgentsComponent implements OnInit {

  areaId!: number;
  agents: AreaAgent[] = [];

  loading = false;
  deleting = false;

  selectedAgent?: AreaAgent;
  showDeleteModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private areaAgentService: AreaAgentService
  ) {}

  ngOnInit(): void {
    this.areaId = Number(this.route.snapshot.paramMap.get('areaId'));
    this.loadAgents();
  }

  loadAgents() {
    this.loading = true;

    this.areaAgentService.findByArea(this.areaId).subscribe({
      next: (data) => {
        this.agents = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  create() {
    this.router.navigate(['/admin/areas', this.areaId, 'agents', 'create']);
  }

  edit(agent: AreaAgent) {
    this.router.navigate(['/admin/areas', this.areaId, 'agents', 'edit',agent.id]);
  }

  openDeleteModal(agent: AreaAgent) {
    this.selectedAgent = agent;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedAgent = undefined;
  }

  confirmDelete() {
    if (!this.selectedAgent) return;

    this.deleting = true;

    this.areaAgentService.remove(this.selectedAgent.id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.loadAgents();
        this.deleting = false;
      },
      error: () => {
        this.deleting = false;
      }
    });
  }
}
