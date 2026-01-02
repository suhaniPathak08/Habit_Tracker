import { useState } from 'react';
import { Container, Button, Spinner, Alert, Row, Col, ButtonGroup } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Header from '../components/Header';
import HabitCard from '../components/HabitCard';
import AddEditHabitModal from '../components/AddEditHabitModal';
import { HabitsProvider, useHabits } from '../contexts';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DashboardContent() {
  const { habits, loading, error } = useHabits();
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [chartDays, setChartDays] = useState(7);
  
  const handleAdd = () => {
    setEditingHabit(null);
    setShowModal(true);
  };
  
  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setShowModal(true);
  };
  
  // Generate chart data
  const generateChartData = () => {
    const today = new Date();
    const dates = [];
    const counts = [];
    
    for (let i = chartDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      const count = habits.filter(h => h.completedDates.includes(dateStr)).length;
      counts.push(count);
    }
    
    return {
      labels: dates,
      datasets: [{
        label: 'Habits Completed',
        data: counts,
        backgroundColor: '#10b981',
        borderRadius: 4
      }]
    };
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };
  
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" aria-label="Loading habits">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }
  
  return (
    <>
      <Header />
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>My Habits</h2>
          <Button onClick={handleAdd} className="btn-primary">
            + Add Habit
          </Button>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        {habits.length === 0 ? (
          <Alert variant="info">
            No habits yet. Click "Add Habit" to create your first one!
          </Alert>
        ) : (
          <>
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Progress Chart</h5>
                <ButtonGroup size="sm">
                  <Button 
                    variant={chartDays === 7 ? 'primary' : 'outline-primary'}
                    onClick={() => setChartDays(7)}
                  >
                    7 Days
                  </Button>
                  <Button 
                    variant={chartDays === 30 ? 'primary' : 'outline-primary'}
                    onClick={() => setChartDays(30)}
                  >
                    30 Days
                  </Button>
                </ButtonGroup>
              </div>
              <div style={{ height: '250px' }} aria-label="Habit completion chart">
                <Bar data={generateChartData()} options={chartOptions} />
              </div>
            </div>
            
            <Row>
              {habits.map(habit => (
                <Col key={habit.id} xs={12} md={6} lg={4} className="mb-3">
                  <HabitCard habit={habit} onEdit={handleEdit} />
                </Col>
              ))}
            </Row>
          </>
        )}
        
        <AddEditHabitModal
          show={showModal}
          onHide={() => setShowModal(false)}
          habit={editingHabit}
        />
      </Container>
    </>
  );
}

export default function Dashboard() {
  return (
    <HabitsProvider>
      <DashboardContent />
    </HabitsProvider>
  );
}
