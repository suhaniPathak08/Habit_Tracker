import { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { toggleHabit as apiToggleHabit, deleteHabit as apiDeleteHabit } from '../api';
import { useHabits } from '../contexts';
import { currentStreak, bestStreak } from '../utils/streaks';

export default function HabitCard({ habit, onEdit }) {
  const { setHabits } = useHabits();
  const [toggling, setToggling] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDates.includes(today);
  
  const handleToggle = async () => {
    setToggling(true);
    
    // Optimistic update
    const newCompletedDates = isCompletedToday
      ? habit.completedDates.filter(d => d !== today)
      : [...habit.completedDates, today];
    
    setHabits(prev => prev.map(h => 
      h.id === habit.id ? { ...h, completedDates: newCompletedDates } : h
    ));
    
    try {
      await apiToggleHabit(habit.id, today);
    } catch (err) {
      // Revert on error
      setHabits(prev => prev.map(h => 
        h.id === habit.id ? habit : h
      ));
      alert('Failed to update habit: ' + err.message);
    } finally {
      setToggling(false);
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm('Delete this habit?')) return;
    
    try {
      await apiDeleteHabit(habit.id);
      setHabits(prev => prev.filter(h => h.id !== habit.id));
    } catch (err) {
      alert('Failed to delete habit: ' + err.message);
    }
  };
  
  const current = currentStreak(habit);
  const best = bestStreak(habit);
  
  return (
    <Card className="h-100 habit-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="mb-0">{habit.title}</h5>
          <Form.Check
            type="checkbox"
            checked={isCompletedToday}
            onChange={handleToggle}
            disabled={toggling}
            aria-label={`Mark ${habit.title} as ${isCompletedToday ? 'incomplete' : 'complete'} for today`}
            className="habit-checkbox"
          />
        </div>
        <p className="text-muted small mb-3">{habit.description}</p>
        
        <div className="mb-3">
          <div className="d-flex gap-3">
            <span className="streak-badge">
              🔥 {current} day{current !== 1 ? 's' : ''}
            </span>
            <span className="text-muted small">
              Best: {best}
            </span>
          </div>
        </div>
        
        <div className="d-flex gap-2">
          <Button size="sm" variant="outline-primary" onClick={() => onEdit(habit)}>
            Edit
          </Button>
          <Button size="sm" variant="outline-danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
