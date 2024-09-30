import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
} from "@chakra-ui/react";
import Categorias from "./Categorias/Categorias";
import Receitas from "./Receitas/Receitas";
import Movimentacoes from "./Movimentacoes/Movimentacoes";
import Despesas from "./Despesas/Despesas";
export default function Finaceiro() {
  return (
    <>
      <div
        style={{
          marginTop: "6rem",
          backgroundColor: "#fff",
          borderRadius: "10px",
          width: "78vw",
        }}
      >
        <Tabs>
          <TabList>
            <Tab
              style={{
                fontWeight: "600",
                fontSize: "1.2rem",
              }}
            >
              Movimentações{" "}
            </Tab>
            <Tab
              style={{
                fontWeight: "600",
                fontSize: "1.2rem",
              }}
            >
              Receitas
            </Tab>
            <Tab
              style={{
                fontWeight: "600",
                fontSize: "1.2rem",
              }}
            >
              Despesas
            </Tab>
            <Tab
              style={{
                fontWeight: "600",
                fontSize: "1.2rem",
              }}
            >
              Categorias
            </Tab>
            
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="blue.500"
            borderRadius="1px"
          />

          <TabPanels>
            <TabPanel>
              <Movimentacoes />
            </TabPanel>
            <TabPanel>
            <Receitas />
            </TabPanel>
            <TabPanel>
            <Despesas />

            </TabPanel>
            <TabPanel>
              <Categorias />
            </TabPanel>
            
          </TabPanels>
        </Tabs>
      </div>
    </>
  );
}
