import Actions from "@src/components/Actions";
import Menu from "@src/components/Menu";
import Mobile from "@src/components/Mobile";
import Viewer from "@src/components/Viewer";
import useMediaQuery from "@src/hooks/useMediaQuery";

function App() {
  const isMobile = useMediaQuery("(max-width: 800px)");
  if (isMobile) return <Mobile />;

  return (
    <div className="flex h-screen p-7">
      <nav className="min-w-[390px] w-1/3">
        <Menu />
      </nav>
      <main className="flex flex-col grow">
        <Actions />
        <Viewer />
      </main>
    </div>
  );
}

export default App;
