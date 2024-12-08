import Products from "./components/Products";
import Projects from "./components/Projects";
import Todos from "./components/Todos";

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center pt-10">
        {/* <Todos /> */}
        {/* <Projects /> */}
        <Products />
      </div>
    </>
  );
}

export default App;
