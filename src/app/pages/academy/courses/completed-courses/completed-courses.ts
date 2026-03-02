import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Course } from '../../../../core/models/academy.models';
import { AcademyStateService } from '../../../../core/services/academy-state.service';
import { Subject, takeUntil } from 'rxjs';
import { CertificateService } from '../../../../core/services/certificate-api.service';
import { SafeUrlPipe } from "../../data/safe-url.pipe";

@Component({
  selector: 'app-completed-courses',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './completed-courses.html',
  styleUrls: ['./completed-courses.scss']
})
export class CompletedCoursesComponent implements OnInit, OnDestroy {

  completedCourses: Course[] = [];
  selectedCourse: Course | null = null
  private destroy$ = new Subject<void>();

  constructor(
    private academyState: AcademyStateService,
    private certificateService: CertificateService
  ) {}

  ngOnInit(): void {
    this.academyState.courses$
      .pipe(takeUntil(this.destroy$))
      .subscribe(courses => {
        this.completedCourses = courses.filter(c => c.examPassed);
      });
  }

  viewCertificate(course: Course): void {
    this.certificateService.openCertificate(course.id);
  }

  replayCourse(course: Course): void {
    this.selectedCourse = course;
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
