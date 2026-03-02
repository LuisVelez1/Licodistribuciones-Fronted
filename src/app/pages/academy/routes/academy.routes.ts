import { Routes } from '@angular/router';
import { AcademyComponent } from '../academy';
import { PendingCoursesComponent } from '../courses/pending-courses/pending-courses';
import { CompletedCoursesComponent } from '../courses/completed-courses/completed-courses';
import { CertificatesComponent } from '../courses/certificates/certificates';

export const ACADEMY_ROUTES: Routes = [
  {
    path: '',
    component: AcademyComponent,
    children: [
      { path: 'pending', component: PendingCoursesComponent },
      { path: 'completed', component: CompletedCoursesComponent },
      { path: 'certificates', component: CertificatesComponent }
    ]
  }
];


