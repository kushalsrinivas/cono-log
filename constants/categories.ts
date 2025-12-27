import { HabitCategory } from '@/types/habit';

export interface CategoryConfig {
  id: HabitCategory;
  icon: string; // Icon name for @expo/vector-icons
  label: string;
}

export const CATEGORIES: CategoryConfig[] = [
  { id: 'Health', icon: 'heart', label: 'Health' },
  { id: 'Fitness', icon: 'dumbbell', label: 'Fitness' },
  { id: 'Learning', icon: 'book', label: 'Learning' },
  { id: 'Work', icon: 'briefcase', label: 'Work' },
  { id: 'Mindfulness', icon: 'spa', label: 'Mindfulness' },
  { id: 'Custom', icon: 'plus', label: 'Custom' },
];

