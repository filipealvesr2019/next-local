import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    TabIndicator,
  } from "@chakra-ui/react";
  
import Bairros from "../Bairros/Bairros";
import Horario from "../Horario/Horario";
import AdminChat from "../AdminChat/AdminChat";
import Clients from "../Clients/Clients";
  export default function Configuracoes() {
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
                Locais{" "}
              </Tab>
              <Tab
                style={{
                  fontWeight: "600",
                  fontSize: "1.2rem",
                }}
              >
                Horario de Funcionamento
              </Tab>
              <Tab
                style={{
                  fontWeight: "600",
                  fontSize: "1.2rem",
                }}
              >
                Chat
              </Tab>
            
              <Tab
                style={{
                  fontWeight: "600",
                  fontSize: "1.2rem",
                }}
              >
                Cadastro atendentes
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
                <Bairros />
              </TabPanel>
              <TabPanel>
              <Horario />
              </TabPanel>
              <TabPanel>
              <AdminChat />
  
              </TabPanel>
            
              <TabPanel>
              <Clients />
  
              </TabPanel>
            
            </TabPanels>
          </Tabs>
        </div>
      </>
    );
  }
  