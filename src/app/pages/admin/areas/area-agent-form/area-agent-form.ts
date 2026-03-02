import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AreaAgentService } from '../../../../core/services/area-agents.service';
import { UserService } from '../../../../core/services/user.service';
import { UserA } from '../../../../core/models/user-admin.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';




@Component({
  selector: 'app-area-agent-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule
],
  templateUrl: './area-agent-form.html',
  styleUrls: ['./area-agent-form.scss']
})
export class AreaAgentFormComponent implements OnInit {

  areaId!: number;
  agentId?: number;
  isEditMode = false;

  loading = false;
  saving = false;
  users: UserA[] = [];
  filteredUsers: UserA[] = [];

  form!: ReturnType<typeof this.fb.group>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private areaAgentService: AreaAgentService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
        userId: [null, Validators.required],
        isLead: [false],
        active: [true]
    });
  }

  ngOnInit(): void {
    this.areaId = Number(this.route.snapshot.paramMap.get('areaId'));
    const id = this.route.snapshot.paramMap.get('id');

    this.loadUsers();

    if (id) {
      this.isEditMode = true;
      this.agentId = Number(id);
      this.loadAgent(this.agentId);
    }
  }

  loadUsers() {
    this.userService.getAllAdminUsers().subscribe({
      next: (data) => {
      this.users = data;
      this.filteredUsers = data;
      this.listenUserChanges();
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
      }
    });
  }

  listenUserChanges() {
  this.form.get('userId')?.valueChanges.subscribe(value => {

      if (typeof value === 'string') {

        const filterValue = value.toLowerCase();

        this.filteredUsers = this.users.filter(user =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(filterValue) ||
          user.email.toLowerCase().includes(filterValue)
        );

      } else {
        this.filteredUsers = this.users;
      }

    });
  }


  loadAgent(id: number) {
    this.loading = true;

    this.areaAgentService.findByArea(this.areaId).subscribe({
      next: (agents) => {
        const agent = agents.find(a => a.id === id);

        if (!agent) {
          this.router.navigate(['/admin/areas', this.areaId, 'agents']);
          return;
        }

        this.form.patchValue({
          userId: agent.userId,
          isLead: agent.isLead,
          active: agent.active
        });

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  save() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.saving = true;

        if (this.isEditMode && this.agentId) {

            this.areaAgentService.update(this.agentId, {
            isLead: this.form.value.isLead,
            active: this.form.value.active
            }).subscribe({
            next: () => {
                this.router.navigate(['/admin/areas', this.areaId, 'agents']);
            },
            error: () => this.saving = false
            });

        } else {

            this.areaAgentService.assign({
            userId: this.form.value.userId,
            areaId: this.areaId,
            isLead: this.form.value.isLead
            }).subscribe({
            next: () => {
                this.router.navigate(['/admin/areas', this.areaId, 'agents']);
            },
            error: () => this.saving = false
            });

        }
    }

    onUserSelected(event: any) {
      const user = event.option.value;

      this.form.patchValue({
        userId: user.id
      });
    }



  cancel() {
    this.router.navigate(['/admin/areas', this.areaId, 'agents']);
  }

}
