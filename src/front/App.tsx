import { PlayerColor } from "../types";
import { ColorSelector } from "./modules/ColorSelector";
import { NameSelector } from "./modules/NameSelector";

function App() {
  return (
    <div className="container">
      <NameSelector onSelect={() => null} />
      <ColorSelector
        onSelect={() => null}
        players={[
          { id: "1", name: "John", color: PlayerColor.RED },
          { id: "2", name: "Eva", color: PlayerColor.YELLOW },
        ]}
      />
    </div>
  );
}

export default App;
