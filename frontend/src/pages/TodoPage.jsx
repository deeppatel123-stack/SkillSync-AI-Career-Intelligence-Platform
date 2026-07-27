import AppLayout from '../components/AppLayout';
import TodoList from '../components/TodoList';
import '../styles/ai.css';

export default function TodoPage() {
  return (
    <AppLayout>
      <div className="container-fluid px-3">
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6 mx-auto">
            <TodoList />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
