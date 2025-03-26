import ProductList from './components/ProductList';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Shopping Cart App</h1>
      </header>
      <main className="app-main">
        <ProductList />
      </main>
    </div>
  );
}

export default App;
