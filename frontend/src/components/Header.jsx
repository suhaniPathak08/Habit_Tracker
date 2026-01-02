import { Navbar, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <Navbar bg="light" className="border-bottom">
      <Container>
        <Navbar.Brand>Habit Tracker</Navbar.Brand>
        <Button variant="outline-secondary" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </Container>
    </Navbar>
  );
}
