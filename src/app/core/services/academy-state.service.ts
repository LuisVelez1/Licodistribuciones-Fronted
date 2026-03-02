import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AcademyApiService } from "./academy-api.service";
import { Course } from "../models/academy.models";
import { UserCourseProgress } from "../models/user-course.model";

@Injectable({ providedIn: 'root' })
export class AcademyStateService {

  private coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$ = this.coursesSubject.asObservable();

  constructor(private api: AcademyApiService) {}

    loadFromBackend(): void {
    this.api.getCourses().subscribe({
      next: courses => {
        const sorted = [...courses].sort((a, b) => a.order - b.order);

        this.api.getMyCourses().subscribe({
          next: progress => {
            const progressMap = new Map(
              progress.map(p => [p.courseId, p])
            );

            const merged = sorted.map(course => {
            const userProgress = progressMap.get(course.id);

                      return {
              ...course,
              examPassed: userProgress?.examPassed ?? false,
              approvedAt: userProgress?.approvedAt,
              score: userProgress?.score,
              attempts: userProgress?.attempts,
              isEnrolled: !!userProgress
            };
          });


            this.coursesSubject.next(merged);
          },
          error: () => this.coursesSubject.next(sorted)
        });
      },
      error: err => {
        console.error('Error cargando cursos', err);
        this.coursesSubject.next([]);
      }
    });
  }


  get courses(): Course[] {
    return this.coursesSubject.value;
  }

  isCourseLockedById(courseId: number): boolean {
    const index = this.courses.findIndex(c => c.id === courseId);
    if (index <= 0) return false;

    return this.courses
      .slice(0, index)
      .some(c => !c.examPassed);
  }
  
    syncProgress(progress: UserCourseProgress[]) {
    const progressMap = new Map(
      progress.map(p => [p.courseId, p])
    );

    const updated = this.courses.map(course => ({
      ...course,
      examPassed: progressMap.get(course.id)?.examPassed ?? false
    }));

    this.coursesSubject.next(updated);
  }
}

