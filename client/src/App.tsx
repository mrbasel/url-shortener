import { Box } from "@chakra-ui/layout";
import MainForm from "./components/MainForm";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Box className="App" h="100vh">
      <Navbar />
      <MainForm />
    </Box>
  );
}

export default App;
