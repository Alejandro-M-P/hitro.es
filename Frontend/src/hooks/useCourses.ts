import { catalogService } from '../services/catalogService';
import { readStorage, writeStorage } from '../services/storage';
import type { LessonVideo } from '../types/domain';

const DEFAULT_UNLOCKED_COUNT = 1;
const STORAGE_KEY = 'hitro_lessons_unlocked_count';

export interface LessonAccess extends LessonVideo {
  isLocked: boolean;
}

interface CoursesAccessModel {
  lessons: LessonAccess[];
  isLoading: boolean;
  load(): Promise<void>;
  isUnlocked(index: number): boolean;
  getUnlockedCount(): number;
  unlockNext(): number;
}

class CoursesAccessState implements CoursesAccessModel {
  public lessons: LessonAccess[] = [];
  public isLoading = true;

  constructor(private readonly baseLessons: LessonVideo[]) {}

  async load(): Promise<void> {
    this.isLoading = true;
    const mergedLessons = await catalogService.getLessonCatalog(this.baseLessons);
    const unlockedCount = this.getUnlockedCount();
    this.lessons = mergedLessons.map((lesson, index) => ({
      ...lesson,
      isLocked: index >= unlockedCount,
    }));
    this.isLoading = false;
  }

  isUnlocked(index: number): boolean {
    return index < this.getUnlockedCount();
  }

  getUnlockedCount(): number {
    const persisted = readStorage<number>(STORAGE_KEY, DEFAULT_UNLOCKED_COUNT);
    if (persisted < DEFAULT_UNLOCKED_COUNT) return DEFAULT_UNLOCKED_COUNT;
    return persisted;
  }

  unlockNext(): number {
    const nextCount = Math.min(this.lessons.length, this.getUnlockedCount() + 1);
    writeStorage(STORAGE_KEY, nextCount);
    return nextCount;
  }
}

export function useCourses(baseLessons: LessonVideo[]): CoursesAccessModel {
  return new CoursesAccessState(baseLessons);
}
