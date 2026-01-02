import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { createHabit, updateHabit } from '../api';
import { useHabits } from '../contexts';

export default function AddEditHabitModal({ show, onHide, habit }) {
  const { setHabits } = useHabits();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [startDate, setStartDate] = useState('');
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setDescription(habit.description);
      setFrequency(habit.frequency);
      setStartDate(habit.startDate);
    } else {
      setTitle('');
      setDescription('');
      setFrequency('daily');
      setStartDate(new Date().toISOString().split('T')[0]);
    }
  }, [habit, show]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const habitData = { title, description, frequency, startDate };
    
    try {
      if (habit) {
        const updated = await updateHabit(habit.id, habitData);
        setHabits(prev => prev.map(h => h.id === habit.id ? updated : h));
      } else {
        const created = await createHabit(habitData);
        setHabits(prev => [...prev, created]);
      }
      onHide();
    } catch (err) {
      alert('Failed to save habit: ' + err.message);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{habit ? 'Edit Habit' : 'Add New Habit'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              aria-label="Habit title"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-label="Habit description"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Frequency</Form.Label>
            <Form.Select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              aria-label="Habit frequency"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              aria-label="Start date"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
